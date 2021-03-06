import React, {useEffect, useRef, useState} from "react";
import {Pagination} from "react-bootstrap";
import {numberOfItemsInPage} from "../../Constants";

const numberOfPagesToShow=10

export default function PaginationComponent(props){
    const [currentPage,updateCurrentPage]=useState(1)
    const [pagesArr,updatePagesArr]=useState([])
    const numberOfPages=useRef(Math.ceil(props.numberOfElements/numberOfItemsInPage))

   useEffect(()=>{
        window.scrollTo(0,0)
    })

    useEffect(()=>{
        numberOfPages.current=Math.ceil(props.numberOfElements/numberOfItemsInPage)
        if(pagesArr.length===0){
            setFirstPages()
        }
        // case that need to remove one page from array
        else if(numberOfPages.current<pagesArr[pagesArr.length-1]){
            let newPagesArr=[...pagesArr]
            newPagesArr.splice(pagesArr.length-1,1)
            if(newPagesArr.length===0){
                clickOnLast()
            }
            else if(currentPage===pagesArr[pagesArr.length-1]){
                clickOnPage(currentPage-1)
            }
            if(newPagesArr.length>0){
                updatePagesArr(newPagesArr)
            }
        }
        else if(numberOfPages.current>pagesArr[pagesArr.length-1] && pagesArr.length<numberOfPagesToShow){
            let newPagesArr=[...pagesArr]
            newPagesArr.push(pagesArr.length+1)
            updatePagesArr(newPagesArr)
        }
    },[props.numberOfElements])

    async function clickOnPage(page){
        await props.fetchData((page-1)*numberOfItemsInPage)
        updateCurrentPage(page)
    }

    async function clickOnLast(){
        await props.fetchData((numberOfPages.current-1)*numberOfItemsInPage)
        let newPagesArr=[]
        let start=numberOfPages.current
        if(numberOfPages.current-numberOfPagesToShow>0 && (numberOfPages.current % numberOfPagesToShow)!==0){
            start=numberOfPages.current % numberOfPagesToShow
        }

        for(let i=start;i>0;i--){
            newPagesArr.push(numberOfPages.current-i+1)
        }
        updateCurrentPage(numberOfPages.current)
        updatePagesArr(newPagesArr)
    }

    async function clickOnFirst(){
        await props.fetchData(0)
        setFirstPages()
    }

    function setFirstPages(){
        let newPagesArr=[]
        let bound=numberOfPagesToShow
        if(numberOfPages.current<numberOfPagesToShow){
            bound=numberOfPages.current
        }
        for(let i=1;i<=bound;i++){
            newPagesArr.push(i)
        }
        updateCurrentPage(1)
        updatePagesArr(newPagesArr)
    }

    async function clickOnPrev(){
        let newEnd=pagesArr[0]-1
        let newStart=newEnd-numberOfPagesToShow+1
        await props.fetchData((newStart-1)*numberOfItemsInPage)
        let newPagesArr=[]
        for(let i=newStart;i<=newEnd;i++){
            newPagesArr.push(i)
        }
        updateCurrentPage(newStart)
        updatePagesArr(newPagesArr)
    }

   async function clickOnNext(){
        let newStart=pagesArr[pagesArr.length-1]+1
        await props.fetchData((newStart-1)*numberOfItemsInPage)
        let end=newStart+numberOfPagesToShow-1
        if(end>numberOfPages.current){
            end=numberOfPages.current
        }
        let newPagesArr=[]
        for(let i=newStart;i<=end;i++){
            newPagesArr.push(i)
        }
        updateCurrentPage(newStart)
        updatePagesArr(newPagesArr)
    }

    return(
        <div>
            {props.draw && <Pagination>
                <Pagination.First data-testid={"first"} onClick={clickOnFirst}/>
                <Pagination.Prev data-testid={"prev"} disabled={pagesArr[0]===1} onClick={clickOnPrev}/>
                {
                    pagesArr.map((page,index)=>
                        <Pagination.Item data-testid={"page"} key={index} onClick={_=>clickOnPage(page)} active={currentPage===page}>{page}</Pagination.Item>)
                }

                <Pagination.Next data-testid={"next"} disabled={pagesArr[pagesArr.length-1]===numberOfPages.current} onClick={clickOnNext}/>
                <Pagination.Last data-testid={"last"} onClick={clickOnLast}/>
            </Pagination>}
        </div>
    )
}