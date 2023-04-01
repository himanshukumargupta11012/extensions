// const http=require("http")

// const server=http.createServer((req,res)=>{
//     if(req.url=='/yes'){console.log(req.url)
//     res.write("hello")
//     res.end()}
// })

// server.listen(8000,'127.0.0.1',()=>
// console.log("ello")
// )

// let person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"}

// console.log(person.firstName)

const fs=require("fs")
var hii
fs.readFile(__dirname+"/test.txt",'utf8',(err,data)=>{
    console.log(data)
    hii=data
})

// console.log(hii)