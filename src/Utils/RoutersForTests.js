import {rest} from "msw";
import {serverAddress} from "../Constants";
import * as dummyData from "./CreateDummyDataForRoutes";
import {cleanup} from "@testing-library/react";

export function preapareTests(server){
    beforeAll(()=>server.listen())
    afterEach(()=>{
        cleanup()
        server.resetHandlers()
    })
    afterAll(()=>server.close())
}

export const createProject=rest.post(serverAddress+`/projects/saveProject`,(req,res,ctx)=>{
    return res(ctx.json({id:1}),ctx.status(200))
})

export const getDBProfiles=rest.get(serverAddress+`/admin/DBProfiles`,(req,res,ctx)=>{
    let data=dummyData.createDataForDBProfiles()
    return res(ctx.json(data),ctx.status(200))
})

export const saveDBProfiles=rest.post(serverAddress+`/admin/updateDBProfiles`,(req,res,ctx)=>{
    return res(ctx.status(200))
})

export const getAHPAdmin=rest.get(serverAddress+`/admin/AHP`,(req,res,ctx)=>{
    let ahp={UML:0.5,SQL:0.2,NFR:0.3}
    return res(ctx.json(ahp),ctx.status(200))
})

export const saveAHPAdmin=rest.post(serverAddress+`/admin/updateAHP`,(req,res,ctx)=>{
    return res(ctx.status(200))
})

export const getNFRAdmin=rest.get(serverAddress+`/admin/NFR`,(req,res,ctx)=>{
    return res(ctx.json(dummyData.createDataForNFRAdmin()),ctx.status(200))
})

export const updateNFRAdmin=rest.post(serverAddress+`/admin/updateNFR`,(req,res,ctx)=>{
    return res(ctx.status(200))
})

export const getProjects=rest.get(serverAddress+`/users/getProjects`,(req,res,ctx)=>{
    let projects={Projects:dummyData.createDataForDashboard(),size:10}
    return res(ctx.json(projects),ctx.status(200))
})

export const getProjectUsers=rest.get(serverAddress+`/projects/getMembers/1`,(req,res,ctx)=>{
    let users=[]
    for(let i=0;i<21;i++){
        users.push("yotam")
    }
    return res(ctx.json({Members:users,size:21}),ctx.status(200))
})

export const addUserToProject=rest.post(serverAddress+`/projects/addMember`,(req,res,ctx)=>{
    return res(ctx.status(200))
})

export const removeUser=rest.delete(serverAddress+`/projects/removeMembers/1/yotam`,(req,res,ctx)=>{
    return res(ctx.status(200))
})

export const register=rest.post(serverAddress + `/auth/Signup`, (req, res, ctx) => {
    if(req.body.Username==="ronny54"){
        return res(ctx.status(409))
    }
    return res(ctx.status(200))
})

export const login=rest.post(serverAddress+`/auth/Login`,(req,res,ctx)=>{
    if(req.body.Username==="abc"){
        return res(ctx.status(409))
    }
    return res(ctx.json(true),ctx.status(200))
})