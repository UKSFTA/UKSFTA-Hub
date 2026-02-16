import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Code, Parent } from "mdast"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

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
        () => (tree: Parent) => {
          visit(tree, "code", (node: Code) => {
            if (node.lang === "dataview" || node.lang === "dataviewjs") {
              const query = node.value.toLowerCase()
              let tableHtml = ""
              
              // 1. RECENT ACTIVITY
              if (query.includes('file.mtime') && query.includes('where file.name != this.file.name')) {
                  const allFiles = getFiles(path.join(process.cwd(), "content"))
                  const recentFiles = allFiles
                      .map(f => {
                          try {
                              const stat = fs.statSync(f)
                              return {
                                  name: path.basename(f, ".md"),
                                  mtime: stat.mtime
                              }
                          } catch (e) {
                              return null
                          }
                      })
                      .filter((f): f is {name: string, mtime: Date} => f !== null && f.name !== "index" && !f.name.includes(".obsidian"))
                      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
                      .slice(0, 10)

                  tableHtml = `| File | Last Modified |\n| :--- | :--- |\n`
                  recentFiles.forEach(f => {
                      tableHtml += `| [[${f.name}]] | ${f.mtime.toLocaleDateString()} |\n`
                  })
              }

              // 2. OPERATIONS
              else if (query.includes('from "operations"')) {
                  const files = getFiles(path.join(process.cwd(), "content", "Operations"))
                  const operations = files.map(f => {
                      try {
                          const content = fs.readFileSync(f, "utf-8")
                          const { data } = matter(cleanMetadata(content))
                          return { 
                              ...data, 
                              op_name: data['op-name'] || data.op_name || path.basename(f, ".md"),
                              fileName: path.basename(f, ".md"),
                              status: data.status || ""
                          }
                      } catch (e) {
                          return { op_name: path.basename(f, ".md"), fileName: path.basename(f, ".md"), status: "" }
                      }
                  })

                  if (query.includes('executing') || query.includes('in progress')) {
                      const active = operations.filter(op => /Executing|In Progress|Active|Approved|Planning/i.test(op.status))
                      tableHtml = `| Operation | Status |\n| :--- | :--- |\n`
                      active.forEach(op => {
                          tableHtml += `| [[${op.fileName}|${op.op_name}]] | ${op.status} |\n`
                      })
                  } 
              }

              if (tableHtml) {
                  node.lang = "markdown"
                  node.value = tableHtml
              } else {
                  node.lang = "text"
                  node.value = "Unhandled Dataview Query"
              }
            }
          })
        },
      ]
    },
  }
}
