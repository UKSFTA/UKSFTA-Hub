<%*
// 1. Prompt for Operation Details
const op_name = await tp.system.prompt("Operation Name (e.g., 'Example Operation')");
if (!op_name) return; // Exit if user cancels
const op_num = await tp.system.prompt("Operation Number (e.g., '2025-002')");
if (!op_num) return; // Exit if user cancels

// 2. Define Paths
const op_folder_name = `Op-${op_num}-${op_name.replace(/ /g, "_")}`;
const op_folder_path = `Operations/${op_folder_name}`;
const aar_file_path = `${op_folder_path}/Post-Op/AAR-${op_num}.md`;
const aar_template_path = "Templates/AAR-Template.md";

// 3. Check if the operation folder exists
const op_folder_exists = await this.app.vault.adapter.exists(op_folder_path);
if (!op_folder_exists) {
    new Notice(`Operation folder not found: ${op_folder_path}. Please create the operation first.`, 5000);
    return;
}

// 4. Get the content from the AAR template
const aar_template_file = this.app.vault.getAbstractFileByPath(aar_template_path);
const aar_content = await this.app.vault.read(aar_template_file);

// 5. Pre-fill with operation details and links
const new_aar_content = aar_content
    .replace('op_name: ""', `op_name: "${op_name}"`)
    .replace('op_num: ""', `op_num: "${op_num}"`)
    .replace('[Operation Name]', op_name)
    .replace('[[CONOP]]', `[[${op_folder_path}/Planning/CONOP-${op_num}|CONOP-${op_num}]]`)
    .replace('[[Op-Log]]', `[[${op_folder_path}/Execution/Op-Log-${op_num}|Op-Log-${op_num}]]`); // Assuming Op-Log also uses op_num

// 6. Create and open the new AAR file
const new_aar_file = await this.app.vault.create(aar_file_path, new_aar_content);
this.app.workspace.activeLeaf.openFile(new_aar_file);

return "";
_%>
