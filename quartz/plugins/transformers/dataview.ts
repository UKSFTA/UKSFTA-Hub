import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Code, Parent, Node } from "mdast"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

async function fetchUnitCommanderData(endpoint: string, apiKey: string) {
  try {
    console.log(`[Dataview] Fetching from UnitCommander: ${endpoint}`)
    const response = await fetch(`https://api.unitcommander.co.uk/api/v1/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    })
    if (!response.ok) {
        console.log(`[Dataview] API Error: ${response.status}`)
        return null
    }
    return await response.json()
  } catch (e) {
    console.error(`[Dataview] Fetch Exception: ${e}`)
    return null
  }
}

export const DataviewEmulation: QuartzTransformerPlugin = () => {
  return {
    name: "DataviewEmulation",
    markdownPlugins() {
      return [
        () => async (tree: Parent) => {
          const promises: Promise<void>[] = []
          
          visit(tree, "code", (node: Code, index: number, parent: Parent) => {
            if (node.lang === "dataview") {
              const query = node.value.toLowerCase()
              const apiKey = process.env.UNIT_COMMANDER_BOT_TOKEN
              const unitId = process.env.UNIT_COMMANDER_COMMUNITY_ID

              console.log(`[Dataview] Found block with query: ${query.substring(0, 50)}...`)

              // Handle Personnel Tables
              if (query.includes('from "personnel/roster"') || query.includes('from "personnel"')) {
                const p = (async () => {
                  let personnel: any[] = []

                  // Try API first
                  if (apiKey && unitId) {
                    const apiData = await fetchUnitCommanderData(`units/${unitId}/members`, apiKey)
                    if (apiData && Array.isArray(apiData)) {
                      console.log(`[Dataview] API returned ${apiData.length} members`)
                      personnel = apiData.map(p => ({
                        full_name: p.name || p.username,
                        rank: p.rank?.name || "Unknown",
                        current_unit: p.unit?.name || "Unassigned",
                        rank_order: p.rank?.order || 99
                      }))
                    }
                  }

                  // Fallback to local
                  if (personnel.length === 0) {
                    const rosterPath = path.join(process.cwd(), "content", "Personnel", "Roster")
                    if (fs.existsSync(rosterPath)) {
                      const files = fs.readdirSync(rosterPath).filter(f => f.endsWith(".md"))
                      console.log(`[Dataview] Using local fallback: ${files.length} files found`)
                      personnel = files.map(f => {
                        const content = fs.readFileSync(path.join(rosterPath, f), "utf-8")
                        const { data } = matter(content)
                        return data
                      })
                    }
                  }

                  if (query.includes("hq") || query.includes("intelligence cell") || query.includes("tfhq")) {
                    const staff = personnel
                      .filter(p => p.current_unit && (
                        p.current_unit.includes("HQ") || 
                        p.current_unit.includes("Intelligence Cell") || 
                        p.current_unit.includes("Med Det HQ") ||
                        p.current_unit.includes("TFHQ")
                      ))
                      .sort((a, b) => (a.rank_order || 99) - (b.rank_order || 99))

                    let table = "| Rank | Name | Unit |\n| :--- | :--- | :--- |\n"
                    staff.forEach(p => {
                      table += `| ${p.rank || "Unknown"} | [[Personnel/Roster/${p.full_name}\|${p.full_name}]] | ${p.current_unit} |\n`
                    })

                    // Replace the node with raw markdown instead of HTML
                    const replacementNode: Node = {
                        type: "paragraph",
                        children: [{ type: "text", value: table }]
                    }
                    parent.children.splice(index, 1, replacementNode)
                    console.log(`[Dataview] Replaced personnel table.`)
                  }
                })()
                promises.push(p)
              }

              // Handle Operations Tables
              if (query.includes('from "operations"')) {
                const p = (async () => {
                    const opsPath = path.join(process.cwd(), "content", "Operations")
                    if (fs.existsSync(opsPath)) {
                      const getFiles = (dir: string): string[] => {
                        const subdirs = fs.readdirSync(dir)
                        const files = subdirs.map((subdir) => {
                          const res = path.resolve(dir, subdir)
                          return fs.statSync(res).isDirectory() ? getFiles(res) : res
                        })
                        return files.flat().filter(f => f.endsWith(".md"))
                      }
    
                      const allOpFiles = getFiles(opsPath)
                      const operations = allOpFiles.map(f => {
                        const content = fs.readFileSync(f, "utf-8")
                        const { data } = matter(content)
                        return data
                      })
    
                      if (query.includes('status = "executing"') || query.includes('status = "in progress"')) {
                        const activeOps = operations
                          .filter(op => op.type === "CONOP" && (op.status === "Executing" || op.status === "In Progress"))
    
                        let table = "| Operation Name | Status |\n| :--- | :--- |\n"
                        activeOps.forEach(op => {
                          table += `| ${op.op_name || "Unknown"} | ${op.status} |\n`
                        })
    
                        const replacementNode: Node = {
                            type: "paragraph",
                            children: [{ type: "text", value: table }]
                        }
                        parent.children.splice(index, 1, replacementNode)
                        console.log(`[Dataview] Replaced operations table.`)
                      }
                    }
                })()
                promises.push(p)
              }
            }
          })
          await Promise.all(promises)
        },
      ]
    },
  }
}
