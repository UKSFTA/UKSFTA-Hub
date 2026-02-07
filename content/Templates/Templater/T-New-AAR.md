<%*
// 1. Prompt for Operation Details
const op-name = await tp.system.prompt("Operation Name (e.g., 'Example Operation')");
if (!op-name) return; // Exit if user cancels
const op-num = await tp.system.prompt("Operation Number (e.g., '2025-002')");
if (!op-num) return; // Exit if user cancels

// 2. Define Paths
const op-folder-name = `Op-${op-num}-${op-name.replace(/ /g, "-")}`;
const op-folder-path = `Operations/${op-folder-name}`;
const aar-file-path = `${op-folder-path}/Post-Op/AAR-${op-num}.md`;
const aar-template-path = "Templates/AAR-Template.md";

// 3. Check if the operation folder exists
const op-folder-exists = await this.app.vault.adapter.exists(op-folder-path);
if (!op-folder-exists) {
    new Notice(`Operation folder not found: ${op-folder-path}. Please create the operation first.`, 5000);
    return;
}

// 4. Get the content from the AAR template
const aar-template-file = this.app.vault.getAbstractFileByPath(aar-template-path);
const aar-content = await this.app.vault.read(aar-template-file);

// 5. Pre-fill with operation details and links
const new-aar-content = aar-content
    .replace('op-name: ""', `op-name: "${op-name}"`)
    .replace('op-num: ""', `op-num: "${op-num}"`)
    .replace('[Operation Name]', op-name)
    .replace('[[CONOP]]', `[[${op-folder-path}/Planning/CONOP-${op-num}|CONOP-${op-num}]]`)
    .replace('[[Op-Log]]', `[[${op-folder-path}/Execution/Op-Log-${op-num}|Op-Log-${op-num}]]`); // Assuming Op-Log also uses op-num

// 6. Create and open the new AAR file
const new-aar-file = await this.app.vault.create(aar-file-path, new-aar-content);
this.app.workspace.activeLeaf.openFile(new-aar-file);

return "";
-%>
