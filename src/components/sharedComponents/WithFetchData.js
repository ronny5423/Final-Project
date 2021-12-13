import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {numberOfItemsInPage, serverAddress} from "../../Constants";
import PaginationComponent from "./PaginationComponent";

const spareDataNumber=5

const withFetchData=(WrappedComponent,projectsArr)=>{
    function WithFetchData(props){
        const[dataLength,updateDataLength]=useState(projectsArr.length)
        let history=useNavigate()
        const [dataToShow,updateData]=useState([])
        const spareData=useRef([])
        const dataToShowEndIndex=useRef(0)
        const otherParametersToSendToServer=useRef({})
        const fetchDataRoute=useRef(``)

        async function fetchProjectsFromServer(startIndex){
            let end
            let numberOfSpare=0
            if(dataLength===0){
                numberOfSpare=spareDataNumber
                end=numberOfItemsInPage+spareDataNumber
            }
            else{
                if(startIndex+numberOfItemsInPage+spareDataNumber<=dataLength){
                    end=startIndex+numberOfItemsInPage+spareDataNumber-1
                    numberOfSpare=spareDataNumber
                }
                else{
                    end=dataLength-1
                    if(end-startIndex+1>numberOfItemsInPage){
                        numberOfSpare=end-startIndex+1-numberOfItemsInPage
                    }
                }
            }
            // otherParametersToSendToServer.current.startIndex=startIndex
            // otherParametersToSendToServer.current.endIndex=end
            // let response= await axios.get(serverAddress+fetchDataRoute.current,{params:otherParametersToSendToServer.current})
            // if(response.status===200){
            //     let endIndex=response.data.data.length-1
            //     if(dataLength===0){
            //         if(response.data.data.length>numberOfItemsInPage){
            //             numberOfSpare=response.data.data.length-numberOfItemsInPage
            //         }
            //         else{
            //             numberOfSpare=0
            //             }
            //     }
            //     if(numberOfSpare>0){
            //         endIndex=numberOfItemsInPage-1
            //         spareData.current=response.data.data.slice(response.data.data.length-numberOfSpare,response.data.data.length)
            //     }
            //     else{
            //         spareData.current=[]
            //     }
            //     updateData(response.data.slice(0,endIndex+1))
            //     updateDataLength(response.data.dataLength)
            //     dataToShowEndIndex.current=end-numberOfSpare
            // }
            // else{
            //     history("/error")
            // }

            let newProjects=projectsArr.slice(startIndex,end+1)
            let endIndex=newProjects.length-1
            if(numberOfSpare>0){
                endIndex=numberOfItemsInPage-1
                spareData.current=newProjects.slice(newProjects.length-numberOfSpare,newProjects.length)
            }
            else{
                spareData.current=[]
            }
            updateData(newProjects.slice(0,endIndex+1))
            updateDataLength(projectsArr.length)
            dataToShowEndIndex.current=end

        }

        function fetchSpareData(startIndex){
            let end
            if(startIndex+spareDataNumber<=dataLength){
                end=startIndex+spareDataNumber-1
            }
            else{
                end=dataLength-1
            }
            // otherParametersToSendToServer.current.startIndex=startIndex
            // otherParametersToSendToServer.current.endIndex=end
            // axios.get(serverAddress+fetchDataRoute.current,{params:otherParametersToSendToServer.current}).then(res=>{
            //     if(res.status===200){
            //         spareData.current=res.data.data.slice(0,res.data.data.length)
            //     }
            //     else{
            //         history("/error")
            //     }
            // })
            spareData.current=projectsArr.slice(startIndex,end+1)
        }

        async function deleteDataFromArray(index,id,route){
            // let response=await axios.delete(serverAddress+route)
            // if(response.status===201){
            //     let newDataArr=[...dataToShow]
            //     projectsArr.splice(0,1)
            //     updateDataLength(dataLength-1)
            //     newDataArr.splice(index,1)
            //     if(spareData.current.length>0){
            //         newDataArr.push(spareData.current[0])
            //         spareData.current.splice(0,1)
            //     }
            //     if(spareData.current.length===0 && dataToShowEndIndex.current<dataLength){
            //         fetchSpareData(dataToShowEndIndex.current+1)
            //     }
            //     if(dataLength===numberOfItemsInPage && newDataArr.length===0){
            //         fetchProjectsFromServer(0)
            //     }
            //     else{
            //         updateData(newDataArr)
            //     }
            // }
            // else{
            //     history(`/error`)
            // }
            let newDataArr=[...dataToShow]
            projectsArr.splice(0,1)
            updateDataLength(dataLength-1)
            newDataArr.splice(index,1)
            if(spareData.current.length>0){
                newDataArr.push(spareData.current[0])
                spareData.current.splice(0,1)
            }
            if(spareData.current.length===0 && dataToShowEndIndex.current<dataLength){
                fetchSpareData(dataToShowEndIndex.current+1)
            }
            if(dataLength===numberOfItemsInPage && newDataArr.length===0){
                fetchProjectsFromServer(0)
            }
            else{
                updateData(newDataArr)
            }
        }

        function updateParametersToSendToServer(params=null){
            for(let key in otherParametersToSendToServer.current){
                if(params[key]!=null){
                    otherParametersToSendToServer.current[key]=params[key]
                    delete params[key]
                }
            }
            otherParametersToSendToServer.current={...otherParametersToSendToServer.current,...params}
        }

        function updateFetchDataRoute(route){
            fetchDataRoute.current=route
        }

        function increaseDataLength(user){
            //check if can update in manage users component
            updateDataLength(dataLength+1)
            projectsArr.push(user)
        }

        return(
            <div>
            <WrappedComponent deleteData={deleteDataFromArray} updateServerParameters={updateParametersToSendToServer}
            dataToShow={dataToShow} fetchDataFromServer={fetchProjectsFromServer} dataLength={dataLength}
            increaseDataLength={increaseDataLength} updateFetchDataRoute={updateFetchDataRoute}
            />
        {
            numberOfItemsInPage<dataLength && <PaginationComponent fetchData={fetchProjectsFromServer} numberOfElements={dataLength}/>
        }
            </div>
        )
    }
    return WithFetchData
}

export default withFetchData