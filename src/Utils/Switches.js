import React from "react";
import {Route,Routes } from "react-router-dom";
import Login from "../components/sharedComponents/Login";
import About from "../components/pageComponents/About";
import ContactForm from "../components/pageComponents/ContactUs";
import UmlEditor from "../components/pageComponents/UmlEditor";
import CreateProjectPage from "../components/pageComponents/CreateProjectPage";
import EditorsTabs from "../components/pageComponents/EditorsTabs";
import HomePage from "../components/pageComponents/HomePage";
import ErrorPage from "../components/pageComponents/ErrorPage";
import AlgorithmResult from "../components/pageComponents/AlgorithmResult";
import SignUp from "../components/pageComponents/SignUp";
import DashboardPage from "../components/pageComponents/DashboardPage";
import ManageProjectUsers from "../components/pageComponents/ManageProjectUsers";
import NFREditor from "../components/pageComponents/NFREditor";
import AdminAddRemoveUsers from "../components/pageComponents/AdminAddRemoveUsers";
import ChangeNFRAdmin from "../components/pageComponents/ChangeNFRAdmin";

export default function Switches(){
    return(
        <Routes>
            <Route path={"/"} element={<ChangeNFRAdmin/>}/>

            <Route path={"/about"} element={<About/>}/>

            <Route path={"/contact"} element={<ContactForm/>}/>

            <Route path={"/UmlEditor"} element={<UmlEditor/>}/>

            <Route path={"/createProject"} element={<CreateProjectPage/>}/>

            <Route path={"/editorsTabs/:projectId"} element={<EditorsTabs/>}>
                <Route path={":umlEditorId/:sqlEditorId/:nfrEditorId"} element={<EditorsTabs/>}/>
                <Route path={":umlEditorId"} element={<EditorsTabs/>}/>
                <Route path={":umlEditorId/:sqlEditorId"} element={<EditorsTabs/>}/>
                <Route path={":umlEditorId/:nfrEditorId"} element={<EditorsTabs/>}/>
                <Route path={":umlEditorId/:ahpEditorId"} element={<EditorsTabs/>}/>
                <Route path={":umlEditorId/:nfrEditorId/:ahpEditorId"} element={<EditorsTabs/>}/>
                <Route path={":umlEditorId/:sqlEditorId/:ahpEditorId"} element={<EditorsTabs/>}/>
                <Route path={":umlEditorId/:sqlEditorId/:nfrEditorId/:ahpEditorId"} element={<EditorsTabs/>}/>
            </Route>

            <Route path={"/error"} element={<ErrorPage/>}/>

            <Route path={"/algorithmResults/:projectId"} element={<AlgorithmResult/>}/>

            <Route path={"/manageUsers/:projectId"} element={<ManageProjectUsers/>}/>

            <Route path={"/home"} element={<HomePage/>}/>

            <Route path={"/login"} element={<Login/>}/>

            <Route path={"/register"} element={ <SignUp/>}/>

            <Route path={"/admin"}>
                <Route path={"addRemoveUsers"} element={<AdminAddRemoveUsers/>}/>
                <Route path={"changeNFR"} element={<ChangeNFRAdmin/>}/>
            </Route>

        </Routes>
    )
}