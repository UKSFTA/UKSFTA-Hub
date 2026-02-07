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
                
                // 1. RECENT ACTIVITY
                if (query.includes('file.mtime') && query.includes('limit 10')) {
                    const allFiles = getFiles(path.join(process.cwd(), "content"))
                    const recentFiles = allFiles
                        .map(f => ({
                            name: path.basename(f, ".md"),
                            path: path.relative(path.join(process.cwd(), "content"), f).replace(".md", ""),
                            mtime: fs.statSync(f).mtime
                        }))
                        .filter(f => f.name !== "index" && !f.path.includes(".obsidian"))
                        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
                        .slice(0, 10)

                    tableHtml = `<table class="dataview-table"><thead><tr><th>File</th><th>Last Modified</th></tr></thead><tbody>`
                    recentFiles.forEach(f => {
                        tableHtml += `<tr><td><a href="./${f.path}">${f.name}</a></td><td>${f.mtime.toLocaleDateString()}</td></tr>`
                    })
                    tableHtml += `</tbody></table>`
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
                                rank_order: p.rank?.order || 99
                            }))
                        }
                    }
                    if (personnel.length === 0) {
                        const files = getFiles(path.join(process.cwd(), "content", "Personnel", "Roster"))
                        personnel = files.map(f => {
                            const { data } = matter(cleanMetadata(fs.readFileSync(f, "utf-8")))
                            return { ...data, path: path.relative(path.join(process.cwd(), "content"), f).replace(".md", "") }
                        })
                    }

                    if (query.includes("hq") || query.includes("intelligence cell") || query.includes("tfhq")) {
                        const staff = personnel
                            .filter(p => p.current_unit && /HQ|Intelligence Cell|Med Det HQ|TFHQ/i.test(p.current_unit))
                            .sort((a, b) => (a.rank_order || 99) - (b.rank_order || 99))

                        tableHtml = `<table class="dataview-table"><thead><tr><th>Rank</th><th>Name</th><th>Unit</th></tr></thead><tbody>`
                        staff.forEach(p => {
                            tableHtml += `<tr><td>${p.rank || "Unknown"}</td><td><a href="./${p.path || 'Personnel/Roster/' + p.full_name}">${p.full_name}</a></td><td>${p.current_unit}</td></tr>`
                        })
                        tableHtml += `</tbody></table>`
                    }
                }

                // 3. OPERATIONS & AARs
                else if (query.includes('from "operations"')) {
                    const files = getFiles(path.join(process.cwd(), "content", "Operations"))
                    const operations = files.map(f => {
                        const { data } = matter(cleanMetadata(fs.readFileSync(f, "utf-8")))
                        const name = path.basename(f, ".md")
                        return { 
                            ...data, 
                            fileName: name,
                            path: path.relative(path.join(process.cwd(), "content"), f).replace(".md", "") 
                        }
                    })

                    // Handle Active Ops
                    if (query.includes('executing') || query.includes('in progress')) {
                        const active = operations.filter(op => 
                            (op.type === "CONOP" || op.fileName.includes("CONOP")) && 
                            /Executing|In Progress|Active/i.test(op.status || "")
                        )
                        if (active.length > 0) {
                            tableHtml = `<table class="dataview-table"><thead><tr><th>Operation</th><th>Status</th></tr></thead><tbody>`
                            active.forEach(op => {
                                tableHtml += `<tr><td><a href="./${op.path}">${op.op_name || op.fileName}</a></td><td>${op.status}</td></tr>`
                            })
                            tableHtml += `</tbody></table>`
                        } else {
                            tableHtml = `<p>No active operations found in database.</p>`
                        }
                    } 
                    // Handle AARs
                    else if (query.includes('type = "aar"') || query.includes('aar')) {
                        const aars = operations.filter(op => 
                            op.type === "AAR" || op.fileName.toLowerCase().includes("aar")
                        ).slice(0, 10)
                        
                        if (aars.length > 0) {
                            tableHtml = `<ul>`
                            aars.forEach(op => {
                                tableHtml += `<li><a href="./${op.path}">${op.op_name || op.fileName}</a></li>`
                            })
                            tableHtml += `</ul>`
                        } else {
                            tableHtml = `<p>No After Action Reports filed.</p>`
                        }
                    }
                }

                if (tableHtml) {
                    node.type = "html" as any
                    node.value = `<div class="dataview-emulation">${tableHtml}</div>`
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
