<%*
// 1. Prompt for Operation Details
const op_name = await tp.system.prompt("Operation Name");
if (!op_name) return; // Exit if user cancels
const op_num = await tp.system.prompt("Operation Number (e.g., 2025-002)");
if (!op_num) return; // Exit if user cancels

// 2. Define Paths
const op_folder_name = `Op-${op_num}-${op_name.replace(/ /g, "_")}`;
const op_folder_path = `Operations/${op_folder_name}`;
const conop_file_path = `${op_folder_path}/Planning/CONOP-${op_num}.md`;
const conop_template_path = "Templates/CONOP-Template.md";

// 3. Create Folder Structure
await this.app.vault.createFolder(`${op_folder_path}/Intel`);
await this.app.vault.createFolder(`${op_folder_path}/Planning`);
await this.app.vault.createFolder(`${op_folder_path}/Execution`);
await this.app.vault.createFolder(`${op_folder_path}/Post-Op`);

// 4. Create the CONOP file from the template
const conop_template_file = this.app.vault.getAbstractFileByPath(conop_template_path);
const conop_content = await this.app.vault.read(conop_template_file);
const new_conop_content = conop_content
    .replace('op_name: ""', `op_name: "${op_name}"`)
    .replace('op_num: ""', `op_num: "${op_num}"`)
    .replace('[Operation/Mission Name]', op_name);

await this.app.vault.create(conop_file_path, new_conop_content);

// 5. Open the new CONOP file
const new_conop_file = this.app.vault.getAbstractFileByPath(conop_file_path);
this.app.workspace.activeLeaf.openFile(new_conop_file);

// 6. This template does not create a note, so we return an empty string.
return "";
_%>
