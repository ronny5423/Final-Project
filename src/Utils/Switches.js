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
// import NFREditor from "../components/pageComponents/NFREditor";
// import AdminAddRemoveUsers from "../components/pageComponents/AdminAddRemoveUsers";
// import ChangeNFRAdmin from "../components/pageComponents/ChangeNFRAdmin";
// import ChangeDBProfiles from "../components/pageComponents/ChangeDBProfiles";
// import ChangeEditorsAhpAdmin from "../components/pageComponents/ChangeEditorsAhpAdmin"
// import AdminPage from "../components/pageComponents/AdminPage";

export default function Switches(){
    return(
        <Routes>
            {localStorage.getItem("username")===null ?
                <Route path={"/"} element={<Login/>}/>
                : <Route path={"/"} element={<DashboardPage/>}/>
            }

            <Route path={"/about"} element={<About/>}/>

            <Route path={"/contact"} element={<ContactForm/>}/>

            <Route path={"/UmlEditor"} element={<UmlEditor/>}/>

            <Route path={"/createProject"} element={<CreateProjectPage/>}/>

            <Route path={"/editorsTabs/:projectId"} element={<EditorsTabs/>}>
                <Route path={":umlAHP/:sqlAHP/:nfrAHP"} element={<EditorsTabs/>}/>
                <Route path={":umlEditorId/:umlAHP/:sqlAHP/:nfrAHP"} element={<EditorsTabs/>}/>
            </Route>

            <Route path={"/dashboard"} element={<DashboardPage/>}/>

            <Route path={"/error"} element={<ErrorPage/>}/>

            <Route path={"/algorithmResults/:projectId"} element={<AlgorithmResult/>}/>

            <Route path={"/manageUsers/:projectId"} element={<ManageProjectUsers/>}/>

            <Route path={"/home"} element={<HomePage/>}/>

            <Route path={"/login"} element={<Login/>}/>

            <Route path={"/register"} element={ <SignUp/>}/>

            {/*<Route path={"/admin"} element={<AdminPage/>}>*/}
            {/*    <Route index element={<AdminAddRemoveUsers/>}/>*/}
            {/*    <Route path={"addRemoveUsers"} element={<AdminAddRemoveUsers/>}/>*/}
            {/*    <Route path={"changeNFR"} element={<ChangeNFRAdmin/>}/>*/}
            {/*    <Route path={"dbProfiles"} element={<ChangeDBProfiles/>}/>*/}
            {/*    <Route path={"editAHP"} element={<ChangeEditorsAhpAdmin/>}/>*/}
            {/*    <Route path={"projects"} element={<DashboardPage/>}/>*/}
            {/*</Route>*/}

        </Routes>
    )
}