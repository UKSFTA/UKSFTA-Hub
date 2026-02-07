import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Code } from "mdast"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export const DataviewEmulation: QuartzTransformerPlugin = () => {
  return {
    name: "DataviewEmulation",
    markdownPlugins() {
      return [
        () => (tree, file) => {
          visit(tree, "code", (node: Code) => {
            if (node.lang === "dataview") {
              const query = node.value.toLowerCase()
              
              // Handle Personnel Tables
              if (query.includes('from "personnel/roster"') || query.includes('from "personnel"')) {
                const rosterPath = path.join(process.cwd(), "content", "Personnel", "Roster")
                if (fs.existsSync(rosterPath)) {
                  const files = fs.readdirSync(rosterPath).filter(f => f.endsWith(".md"))
                  const personnel = files.map(f => {
                    const content = fs.readFileSync(path.join(rosterPath, f), "utf-8")
                    const { data } = matter(content)
                    return data
                  })

                  // Filter for Command Staff specifically for the Hub
                  if (query.includes("hq") || query.includes("intelligence cell")) {
                    const staff = personnel
                      .filter(p => p.current_unit && (
                        p.current_unit.includes("HQ") || 
                        p.current_unit.includes("Intelligence Cell") || 
                        p.current_unit.includes("Med Det HQ")
                      ))
                      .sort((a, b) => (a.rank_order || 99) - (b.rank_order || 99))

                    let table = "| Rank | Name | Unit |
| :--- | :--- | :--- |
"
                    staff.forEach(p => {
                      table += `| ${p.rank || "Unknown"} | [[Personnel/Roster/${p.full_name}\|${p.full_name}]] | ${p.current_unit} |
`
                    })

                    node.type = "html"
                    node.value = `<div class="dataview-emulation">${table}</div>`
                  }
                }
              }
            }
          })
        },
      ]
    },
  }
}
