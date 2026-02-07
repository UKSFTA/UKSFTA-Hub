<%*
// 1. Prompt for Personnel Details
const full_name = await tp.system.prompt("Full Name");
if (!full_name) return; // Exit if user cancels
// Function to parse ranks from the content
function parseRanks(content) {
    const ranks = [];
    const officerRegex = /^- (.*?) \(OF-\d+\)/gm;
    const otherRegex = /^- (.*?) \((WO|SSgt|Sgt|Cpl|LCpl|Pte)\d*\)/gm;
    const recruitRegex = /^- (Recruit)/gm; // Add regex for Recruit

    let match;
    while ((match = officerRegex.exec(content)) !== null) {
        ranks.push(match[1].trim());
    }
    while ((match = otherRegex.exec(content)) !== null) {
        ranks.push(match[1].trim());
    }
    while ((match = recruitRegex.exec(content)) !== null) {
        ranks.push(match[1].trim());
    }
    return ranks;
}

// Read the UK Military Ranks note
const ranks_note_path = "Documentation/UK-Military-Ranks.md";
const ranks_note_file = this.app.vault.getAbstractFileByPath(ranks_note_path);
const ranks_content = await this.app.vault.read(ranks_note_file);
const availableRanks = parseRanks(ranks_content);

// Prompt for Rank with suggester
const rank = await tp.system.suggester(availableRanks, availableRanks, false, "Select Rank");
if (!rank) return; // Exit if user cancels

// Define rankOrderMap directly in the script or fetch from a file
const rankOrderMap = {
    "Field Marshal": 1, "General": 2, "Lieutenant General": 3, "Major General": 4, "Brigadier": 5, "Colonel": 6,
    "Lieutenant Colonel": 7, "Major": 8, "Captain": 9, "Lieutenant": 10, "Second Lieutenant": 11, "Officer Cadet": 12,
    "Warrant Officer Class 1": 13, "Warrant Officer Class 2": 14, "Staff Sergeant": 15, "Sergeant": 16,
    "Corporal": 17, "Lance Corporal": 18, "Private": 19, "Trooper": 19, "Recruit": 20,
    "Commander": 7, "Flight Lieutenant": 9, "Flying Officer": 10
};

const rank_order = rankOrderMap[rank] || 99; // Default to 99 if rank not found

// 2. Define File Name and Path
const file_name = `${full_name.split(" ").join("_")}.md`;
const file_path = `Personnel/Candidates/${file_name}`;

// 3. Get the content from the original personnel template
const template_path = "Templates/Personnel-Template.md";
const template_file = this.app.vault.getAbstractFileByPath(template_path);
const template_content = await this.app.vault.read(template_file);

// 4. Replace placeholders
const new_content = template_content
    .replace('full_name: ""', `full_name: "${full_name}"`)
    .replace('rank: ""', `rank: "${rank}"\nrank_order: ${rank_order}`)
    .replace('# {{full_name}}', `# ${full_name}`)
    .replace(/- \*\*Rank:\*\* \{\{rank\}\}/, `- **Rank:** ${rank}`)
    .replace('date_joined: {{date}}', `date_joined: ${tp.date.now("YYYY-MM-DD")}`);

// 5. Create and open the new file
const new_file = await this.app.vault.create(file_path, new_content);
this.app.workspace.activeLeaf.openFile(new_file);

return "";
_%>
