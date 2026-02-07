import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Code, Parent, Node } from "mdast"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

async function fetchUnitCommanderData(endpoint: string, apiKey: string) {
  try {
    const response = await fetch(`https://api.unitcommander.co.uk/api/v1/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    })
    if (!response.ok) return null
    return await response.json()
  } catch (e) {
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

              // Handle Personnel Tables
              if (query.includes('from "personnel/roster"') || query.includes('from "personnel"')) {
                const p = (async () => {
                  let personnel: any[] = []

                  if (apiKey && unitId) {
                    // Try different potential endpoints
                    const apiData = await fetchUnitCommanderData(`units/${unitId}/members`, apiKey) || 
                                    await fetchUnitCommanderData(`units/${unitId}/roster`, apiKey)
                    
                    if (apiData && Array.isArray(apiData)) {
                      personnel = apiData.map(p => ({
                        full_name: p.name || p.username,
                        rank: p.rank?.name || "Unknown",
                        current_unit: p.unit?.name || "Unassigned",
                        rank_order: p.rank?.order || 99
                      }))
                    }
                  }

                  if (personnel.length === 0) {
                    const rosterPath = path.join(process.cwd(), "content", "Personnel", "Roster")
                    if (fs.existsSync(rosterPath)) {
                      const files = fs.readdirSync(rosterPath).filter(f => f.endsWith(".md"))
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

                    let tableHtml = `<table class="dataview-table"><thead><tr><th>Rank</th><th>Name</th><th>Unit</th></tr></thead><tbody>`
                    staff.forEach(p => {
                      tableHtml += `<tr><td>${p.rank || "Unknown"}</td><td>${p.full_name}</td><td>${p.current_unit}</td></tr>`
                    })
                    tableHtml += `</tbody></table>`

                    node.type = "html" as any
                    node.value = tableHtml
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
    
                        let tableHtml = `<table class="dataview-table"><thead><tr><th>Operation</th><th>Status</th></tr></thead><tbody>`
                        activeOps.forEach(op => {
                          tableHtml += `<tr><td>${op.op_name || "Unknown"}</td><td>${op.status}</td></tr>`
                        })
                        tableHtml += `</tbody></table>`

                        node.type = "html" as any
                        node.value = tableHtml
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
