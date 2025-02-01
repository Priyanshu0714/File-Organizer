//program to organise the type of file in a particular folder
const express=require("express")
const path= require("path")
const fs = require("fs/promises");
const fs_move = require("fs-extra");
const { log, error } = require("console");
const app=express();
const port=3000

app.get("/", async (req,res,next)=>{
    const file_path=path.join(__dirname,"/test-files")
    const files= await fs.readdir(file_path)
    const main_dir=await fs.readdir(__dirname)
    //todo-> to store the file extension as a list
    const mainDirList = new Set(main_dir.map(file => path.basename(file)));
    //todo-> to get all the extention of files avilable in the current directory
    
    for(i in files)
    {
        const currentFileExtension = path.basename(files[i]).split(".")[1];
        const currentFileName=path.basename(files[i].split(".")[0])        
        const targetDir=path.join(__dirname,currentFileExtension)                

        if(!mainDirList.has(currentFileExtension))
        {
            await fs.mkdir(targetDir)
            mainDirList.add(currentFileExtension);
        }
        
        const movingPath=path.join(file_path,files[i])
        const destinationPath=path.join(targetDir,currentFileName+"."+currentFileExtension)        
        
        
        try{
            await fs_move.move(movingPath,destinationPath);
            console.log(`File (${currentFileName}) moved successfully`);
        }catch(err){
            console.log(`Error encountered while moving for the file ${files[i]}`);
        }
    }
    next();
})

app.get("/",(req,res)=>{
    res.send("Working with your files")
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})