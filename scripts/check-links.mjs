import fs from 'fs'
import path from 'path'

function getFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const name = path.join(dir, file)
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, allFiles)
    } else {
      allFiles.push(name)
    }
  }
  return allFiles
}

async function checkLinks() {
  console.log("🔍 Starting Link Validation Audit...")
  
  const contentDir = path.join(process.cwd(), 'content')
  if (!fs.existsSync(contentDir)) {
      console.error("❌ Content directory not found.")
      process.exit(1)
  }

  const files = getFiles(contentDir)
  
  const validTargets = new Set()
  const basenameMap = new Map()

  files.forEach(file => {
    const relative = path.relative(contentDir, file)
    const slug = relative.replace(/\.md$/, '')
    const name = path.basename(file, '.md')
    
    validTargets.add(slug)
    validTargets.add(relative)
    
    if (!basenameMap.has(name)) basenameMap.set(name, [])
    basenameMap.get(name).push(slug)
  })

  let brokenCount = 0
  let looseTacCount = 0
  // Ignore Templates folder for link checks
  const mdFiles = files.filter(f => f.endsWith('.md') && !f.includes('/Templates/'))

  for (const file of mdFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    
    // Check for loose tacs (single hyphen on a line by itself)
    const lines = content.split('\n')
    lines.forEach((line, index) => {
        if (line.trim() === '-') {
            console.error(`⚠️ LOOSE TAC: Single hyphen used as separator in ${path.relative(process.cwd(), file)} on line ${index + 1}`)
            looseTacCount++
        }
    })

    const wikilinkRegex = /\[\[(.*?)\]\]/g
    const markdownLinkRegex = /\[.*?\]\((?!(?:http|#))(.*?)\)/g
    let match

    while ((match = wikilinkRegex.exec(content)) !== null) {
      const rawTarget = match[1].split('|')[0].split('#')[0].split('^')[0].trim()
      
      if (!rawTarget || rawTarget.includes('$') || rawTarget.includes('{')) continue

      const sanitizedTarget = decodeURIComponent(rawTarget).replace(/ /g, '-')
      
      if (validTargets.has(sanitizedTarget)) continue
      
      const targetBase = path.basename(sanitizedTarget)
      if (basenameMap.has(targetBase)) continue

      console.error(`❌ BROKEN WIKILINK: [[${rawTarget}]] in ${path.relative(process.cwd(), file)}`)
      brokenCount++
    }

    while ((match = markdownLinkRegex.exec(content)) !== null) {
      const rawTarget = match[1].split('#')[0].split('^')[0].trim()
      
      if (!rawTarget || rawTarget.endsWith('.png') || rawTarget.endsWith('.jpg') || rawTarget.endsWith('.pdf')) continue

      const sanitizedTarget = decodeURIComponent(rawTarget).replace(/\.md$/, '').replace(/ /g, '-')
      
      // Check relative paths
      const dir = path.dirname(file)
      const absoluteTarget = path.resolve(dir, decodeURIComponent(rawTarget).replace(/\.md$/, ''))
      const relativeToContent = path.relative(contentDir, absoluteTarget)

      if (validTargets.has(relativeToContent) || validTargets.has(sanitizedTarget)) continue

      const targetBase = path.basename(sanitizedTarget)
      if (basenameMap.has(targetBase)) continue

      console.error(`❌ BROKEN MARKDOWN LINK: [link](${rawTarget}) in ${path.relative(process.cwd(), file)}`)
      brokenCount++
    }
  }

  if (brokenCount > 0 || looseTacCount > 0) {
    console.error(`\n🚨 Audit Failed: ${brokenCount} broken links, ${looseTacCount} loose tacs found.`)
    process.exit(1)
  } else {
    console.log("✅ All links and formatting verified. Audit passed.")
  }
}

checkLinks().catch(err => {
  console.error(err)
  process.exit(1)
})
