import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Code, Parent } from "mdast"
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

const getFiles = (dir: string): string[] => {
    if (!fs.existsSync(dir)) return []
    const subdirs = fs.readdirSync(dir)
    const files = subdirs.map((subdir) => {
      const res = path.resolve(dir, subdir)
      return fs.statSync(res).isDirectory() ? getFiles(res) : res
    })
    return files.flat().filter(f => f.endsWith(".md"))
}

function cleanMetadata(content: string): string {
    let cleaned = content.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    const today = new Date().toISOString().split('T')[0]
    cleaned = cleaned.replace(/<% tp\.date\.now\(.*?\) %>/g, today)
    return cleaned
}

export const DataviewEmulation: QuartzTransformerPlugin = () => {
  return {
    name: "DataviewEmulation",
    textTransform(_ctx, src) {
        return cleanMetadata(typeof src === 'string' ? src : src.toString())
    },
    markdownPlugins() {
      return [
        () => async (tree: Parent) => {
          const promises: Promise<void>[] = []
          
          visit(tree, "code", (node: Code, index: number, parent: Parent) => {
            if (node.lang === "dataview" || node.lang === "dataviewjs") {
              const query = node.value.toLowerCase()
              const apiKey = process.env.UNIT_COMMANDER_BOT_TOKEN
              const unitId = process.env.UNIT_COMMANDER_COMMUNITY_ID

              const p = (async () => {
                let tableHtml = ""
                let useMarkdown = false
                
                // 1. RECENT ACTIVITY
                if (query.includes('file.mtime') && query.includes('where file.name != this.file.name')) {
                    const allFiles = getFiles(path.join(process.cwd(), "content"))
                    const recentFiles = allFiles
                        .map(f => {
                            const stat = fs.statSync(f)
                            return {
                                name: path.basename(f, ".md"),
                                mtime: stat.mtime
                            }
                        })
                        .filter(f => f.name !== "index" && !f.name.includes(".obsidian"))
                        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
                        .slice(0, 10)

                    tableHtml = `| File | Last Modified |\n| :--- | :--- |\n`
                    recentFiles.forEach(f => {
                        tableHtml += `| [[${f.name}]] | ${f.mtime.toLocaleDateString()} |\n`
                    })
                    useMarkdown = true
                }

                // 2. PERSONNEL
                else if (query.includes('from "personnel')) {
                    let personnel: any[] = []
                    if (apiKey && unitId) {
                        const apiData = await fetchUnitCommanderData(`units/${unitId}/members`, apiKey) || 
                                        await fetchUnitCommanderData(`units/${unitId}/roster`, apiKey)
                        if (apiData && Array.isArray(apiData)) {
                            personnel = apiData.map(p => ({
                                full_name: p.name || p.username,
                                rank: p.rank?.name || "Unknown",
                                current_unit: p.unit?.name || "Unassigned",
                                rank_order: p.rank?.order || 99,
                                fileName: p.name || p.username
                            }))
                        }
                    }
                    if (personnel.length === 0) {
                        const files = getFiles(path.join(process.cwd(), "content", "Personnel", "Roster"))
                        personnel = files.map(f => {
                            const { data } = matter(cleanMetadata(fs.readFileSync(f, "utf-8")))
                            return { 
                                full_name: data['full-name'] || data.full_name || path.basename(f, ".md"),
                                rank: data.rank || "Unknown",
                                current_unit: data['current-unit'] || data.current_unit || "Unassigned",
                                rank_order: data['rank-order'] || data.rank_order || 99,
                                status: data.status || "Active",
                                fileName: path.basename(f, ".md")
                            }
                        })
                    }

                    if (query.includes("hq") || query.includes("intelligence cell") || query.includes("tfhq")) {
                        const staff = personnel
                            .filter(p => p.current_unit && /HQ|Intelligence Cell|Med Det HQ|TFHQ/i.test(p.current_unit))
                            .sort((a, b) => (a.rank_order || 99) - (b.rank_order || 99))

                        tableHtml = `| Rank | Name | Unit |\n| :--- | :--- | :--- |\n`
                        staff.forEach(p => {
                            tableHtml += `| ${p.rank} | [[${p.fileName}|${p.full_name}]] | ${p.current_unit} |\n`
                        })
                        useMarkdown = true
                    }
                    else if (query.includes('status = "basic training"') || query.includes('status = "jsfaw"') || query.includes('continuation')) {
                        let filtered = []
                        if (query.includes('basic training')) filtered = personnel.filter(p => p.status === "Basic Training")
                        else if (query.includes('jsfaw')) filtered = personnel.filter(p => p.status === "JSFAW")
                        else if (query.includes('continuation')) filtered = personnel.filter(p => p.status?.includes("Continuation"))

                        tableHtml = `| Name | Unit |\n| :--- | :--- |\n`
                        filtered.forEach(p => {
                            tableHtml += `| [[${p.fileName}|${p.full_name}]] | ${p.current_unit} |\n`
                        })
                        useMarkdown = true
                    }
                }

                // 3. OPERATIONS
                else if (query.includes('from "operations"')) {
                    const files = getFiles(path.join(process.cwd(), "content", "Operations"))
                    const operations = files.map(f => {
                        const { data } = matter(cleanMetadata(fs.readFileSync(f, "utf-8")))
                        return { 
                            ...data, 
                            op_name: data['op-name'] || data.op_name || path.basename(f, ".md"),
                            fileName: path.basename(f, ".md"),
                            status: data.status || ""
                        }
                    })

                    if (query.includes('executing') || query.includes('in progress')) {
                        const active = operations.filter(op => /Executing|In Progress|Active|Approved|Planning/i.test(op.status))
                        tableHtml = `| Operation | Status |\n| :--- | :--- |\n`
                        active.forEach(op => {
                            tableHtml += `| [[${op.fileName}|${op.op_name}]] | ${op.status} |\n`
                        })
                        useMarkdown = true
                    } 
                }

                if (tableHtml) {
                    if (useMarkdown) {
                        // Use raw text for markdown tables to be parsed by GFM transformer later
                        node.type = "text" as any
                        node.value = `\n${tableHtml}\n`
                    } else {
                        node.type = "html" as any
                        node.value = `<div class="dataview-emulation">${tableHtml}</div>`
                    }
                } else {
                    node.type = "html" as any
                    node.value = `<!-- Unhandled Dataview Query -->`
                }
              })()
              promises.push(p)
            }
          })
          await Promise.all(promises)
        },
      ]
    },
  }
}
