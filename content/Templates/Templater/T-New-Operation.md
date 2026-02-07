<%*
// 1. Prompt for Operation Details
const op-name = await tp.system.prompt("Operation Name");
if (!op-name) return; // Exit if user cancels
const op-num = await tp.system.prompt("Operation Number (e.g., 2025-002)");
if (!op-num) return; // Exit if user cancels

// 2. Define Paths
const op-folder-name = `Op-${op-num}-${op-name.replace(/ /g, "-")}`;
const op-folder-path = `Operations/${op-folder-name}`;
const conop-file-path = `${op-folder-path}/Planning/CONOP-${op-num}.md`;
const conop-template-path = "Templates/CONOP-Template.md";

// 3. Create Folder Structure
await this.app.vault.createFolder(`${op-folder-path}/Intel`);
await this.app.vault.createFolder(`${op-folder-path}/Planning`);
await this.app.vault.createFolder(`${op-folder-path}/Execution`);
await this.app.vault.createFolder(`${op-folder-path}/Post-Op`);

// 4. Create the CONOP file from the template
const conop-template-file = this.app.vault.getAbstractFileByPath(conop-template-path);
const conop-content = await this.app.vault.read(conop-template-file);
const new-conop-content = conop-content
    .replace('op-name: ""', `op-name: "${op-name}"`)
    .replace('op-num: ""', `op-num: "${op-num}"`)
    .replace('[Operation/Mission Name]', op-name);

await this.app.vault.create(conop-file-path, new-conop-content);

// 5. Open the new CONOP file
const new-conop-file = this.app.vault.getAbstractFileByPath(conop-file-path);
this.app.workspace.activeLeaf.openFile(new-conop-file);

// 6. This template does not create a note, so we return an empty string.
return "";
-%>
