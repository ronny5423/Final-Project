import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {numberOfItemsInPage, serverAddress} from "../../Constants";
import PaginationComponent from "./PaginationComponent";
import SavingSpinner from "./SavingSpinner";
import LoadingSpinner from "./LoadingSpinner";

const spareDataNumber=5

const withFetchData=(WrappedComponent)=>{
    function WithFetchData(props){
        const[dataLength,updateDataLength]=useState(0)
        let history=useNavigate()
        const [dataToShow,updateData]=useState([])
        const spareData=useRef([])
        const dataToShowEndIndex=useRef(0)
        const otherParametersToSendToServer=useRef({})
        const fetchDataRoute=useRef(``)
        const attributeName=useRef("")
        const[saving,updateSaving]=useState(false)
        const [loading,updateLoading]=useState(false)

        async function fetchProjectsFromServer(startIndex){
            let end
            let numberOfSpare=0
            if(dataLength===0){
                numberOfSpare=spareDataNumber
                end=numberOfItemsInPage+spareDataNumber-1
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
            otherParametersToSendToServer.current.startIndex=startIndex
            otherParametersToSendToServer.current.endIndex=end+1
            if(!saving){
                updateLoading(true)
            }
            axios.get(serverAddress+fetchDataRoute.current,{params:otherParametersToSendToServer.current}).then(response=>{
                if(response.status===200){
                    let endIndex=response.data[attributeName.current].length-1
                    if(dataLength===0){
                        if(response.data[attributeName.current].length>numberOfItemsInPage){
                            numberOfSpare=response.data[attributeName.current].length-numberOfItemsInPage
                        }
                        else{
                            numberOfSpare=0
                        }
                    }
                    if(numberOfSpare>0){
                        endIndex=numberOfItemsInPage-1
                        spareData.current=response.data[attributeName.current].slice(response.data[attributeName.current].length-numberOfSpare,response.data[attributeName.current].length)
                    }
                    else{
                        spareData.current=[]
                    }
                    updateData(response.data[attributeName.current].slice(0,endIndex+1))
                    updateDataLength(response.data.size)
                    dataToShowEndIndex.current=end-numberOfSpare
                    updateLoading(false)
                }
                else{
                    history("/error")
                }
            })
        }

        function fetchSpareData(startIndex){
            let end
            if(startIndex+spareDataNumber<=dataLength){
                end=startIndex+spareDataNumber-1
            }
            else{
                end=dataLength-1
            }
            otherParametersToSendToServer.current.startIndex=startIndex
            otherParametersToSendToServer.current.endIndex=end+1
            axios.get(serverAddress+fetchDataRoute.current,{params:otherParametersToSendToServer.current}).then(res=>{
                if(res.status===200){
                    spareData.current=res.data[attributeName.current].slice(0,res.data[attributeName.current].length)
                }
                else{
                    history("/error")
                }
            })
         }

        function deleteDataFromArray(index,route){
            updateSaving(true)
            axios.delete(serverAddress+route).then(response=>{
                if(response.status===200){
                    let newDataArr=[...dataToShow]
                    newDataArr.splice(index,1)
                    if(spareData.current.length>0){// if have spares
                        newDataArr.push(spareData.current[0])
                        spareData.current.splice(0,1)
                        //if can fetch more spares and there are spares to fetch
                        if(spareData.current.length===0 && dataToShowEndIndex.current<dataLength-1){
                            fetchSpareData(dataToShowEndIndex.current+1)
                        }
                    }
                    if(newDataArr.length===0 && dataLength-1>0){ //if deleted only element in last page
                        fetchProjectsFromServer(dataLength-1-numberOfItemsInPage)
                    }
                    else{
                        updateData(newDataArr)
                    }
                    updateDataLength(dataLength-1)
                }
                else{
                    history(`/error`)
                }
                updateSaving(false)
            })
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

        function updateFetchDataRoute(route,name){
            fetchDataRoute.current=route
            attributeName.current=name
        }

        function increaseDataLength(user){
            //check if can update in manage users component
            if(dataLength+1<=numberOfItemsInPage){
                let newDataToShow=[...dataToShow]
                newDataToShow.push(user)
                updateData(newDataToShow)
            }
            updateDataLength(dataLength+1)
            }

        return(
            <div>
                {loading && <LoadingSpinner/>}
            <WrappedComponent deleteData={deleteDataFromArray} updateServerParameters={updateParametersToSendToServer}
            dataToShow={dataToShow} fetchDataFromServer={fetchProjectsFromServer} dataLength={dataLength} draw={!loading}
            increaseDataLength={increaseDataLength} updateFetchDataRoute={updateFetchDataRoute} {...props}
            />
                {saving && <SavingSpinner/>}
        {
            numberOfItemsInPage<dataLength && <PaginationComponent draw={!loading} fetchData={fetchProjectsFromServer} numberOfElements={dataLength}/>
        }
            </div>
        )
    }
    return WithFetchData
}

export default withFetchData