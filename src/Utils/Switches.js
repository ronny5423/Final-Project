import React from "react";
import {Route, Switch} from "react-router-dom";
import Login from "../components/sharedComponents/Login";
import About from "../components/pageComponents/About";
import ContactForm from "../components/pageComponents/ContactUs";
import UmlEditor from "../components/pageComponents/UmlEditor";
import SqlEditor from "../components/pageComponents/SqlEditor";
import CreateProjectPage from "../components/pageComponents/CreateProjectPage";
import EditorsTabs from "../components/pageComponents/EditorsTabs";
import HomePage from "../components/pageComponents/HomePage";
import ErrorPage from "../components/pageComponents/ErrorPage";
import AlgorithmResult from "../components/pageComponents/AlgorithmResult";

export default function Switches(){
    return(
        <Switch>
            <Route path={"/about"}>
                <About/>
            </Route>
            <Route path={"/contact"}>
                <ContactForm/>
            </Route>
            <Route path={"/UmlEditor"} >
                <UmlEditor/>
            </Route>
            <Route path={"/SqlEditor"} >
                <SqlEditor/>
            </Route>
            <Route path={"/createProject"}>
                <CreateProjectPage/>
            </Route>
            <Route path={"/editorsTabs"}>
                <EditorsTabs />
            </Route>
            <Route path={"/"}>
                <CreateProjectPage/>
            </Route>
            <Route path={"/error"}>
                <ErrorPage/>
            </Route>
            <Route path={"/algorithmResult"}>
                <AlgorithmResult projectIndex={localStorage.getItem("currentProjectIndex")}/>
            </Route>
        </Switch>
    )
}