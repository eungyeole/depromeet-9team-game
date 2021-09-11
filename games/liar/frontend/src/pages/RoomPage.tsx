import { useEffect, useRef } from "react";
import { FC } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import styled from '@emotion/styled';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as StompJs from '@stomp/stompjs';
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useState } from "react";
import roomAPI from '../libs/apis/room';
import { keyframes } from '@emotion/react';

interface Props {
    code: string,
}
   
const RoomPage: FC<RouteComponentProps<Props>> = ({match}) => {
    const [users, setUsers] = useState<string[]>([]);
    const [isStart, setIsStart] = useState<boolean>(false);
    const [isAnimation, setIsAnimation] = useState<boolean>(false);
    const [select, setSelect] = useState<string>("");
    const [subject, setSubject] = useState("");
    const stompClient = useRef<any>(null);
    const [result, setResult] = useState<any>([]);
    const history = useHistory();
    const { code } = match.params;
    const name = localStorage.getItem("name");
    
    function connect(){
        const ws = new SockJS("http://211.38.86.92:8010/websocket");
        stompClient.current = Stomp.over(ws);
        stompClient.current.connect({}, onConnected, (msg: any)=>console.log(msg))
    }
    function onConnected(){
        stompClient.current.subscribe(`/sub/chatroom/${code}`, (msg: any)=>{
            const { type, message, memberResponses, userVoteResponseList, winner } = JSON.parse(msg.body);
            type==="JOIN" && setUsers((oldUsers)=>[...oldUsers, message])
            if(type==="START"){
                setIsStart(true);
                setIsAnimation(true);
                const result = memberResponses.filter((data: any)=>data.name===name);
                setSubject(result[0].subject);
            }
            type==="VOTE" && setResult(userVoteResponseList); 
            if(type==="VOTE_END") {
                setIsStart(false);
                setSubject("");
                setSelect("");
                setResult([]);
                
                alert(`${winner}의 승리`);

            }
            
        
        });
        stompClient.current.publish({
            destination: `/pub/chatroom/${code}`,
            body: name,
        })
    }
    function onStart(){
        stompClient.current.publish({
            destination: `/pub/game/${code}`,
        })
    }
    function onStop(){ 
        stompClient.current.publish({
            destination: `/pub/game/finish/${code}`,
        })
    }
    function onSelect(name: string){
        isStart && setSelect(name);
    }
    useEffect(()=>{
        !name && history.push("/");
        (async()=>{
            const { data } = await roomAPI.getUsers(code);
            setUsers(data);
            connect();
        })()
        
        return () => stompClient.current.disconnect();
    },[])
    useEffect(()=>{
        select && stompClient.current.publish({
            destination: `/pub/vote/${code}`,
            body: JSON.stringify({
                username: name,
                suspendName: select
            })
        })
    },[select])
    function getCount(a: string){
        const countObject = result.filter((data:any)=>data.name === a);
        return countObject.length===0 ? 0 : countObject[0].count
    }
    return(
        <>
            {isAnimation && 
                <Modal subject={subject}>
                    <div className="close" onClick={()=>setIsAnimation(false)}>X</div>
                    <div className="title__sub">제시어</div>
                    { subject && <div className="title__main">{subject}</div> }
                </Modal>
            }
            <Block>
                <div className="invite-code">
                    초대코드는
                    <CopyToClipboard text={code} onCopy={()=>alert("복사완료!")}>
                        <span>{code}</span>
                    </CopyToClipboard>
                    입니다.
                </div>  
                <div className="list">
                    <div className="list__title">접속 현황 (<span> {users.length} </span> 명)</div>
                    <ul className="list__wrap">
                        {users.map((i, index)=>(select===i ? 
                            <li className="select" onClick={()=>onSelect(i)} key={index}>
                                <div className="name">{i}</div>
                                <div className="count">{getCount(i)} 표</div>
                            </li> 
                            : <li onClick={()=>onSelect(i)} key={index}>
                                <div className="name">{i}</div>
                                <div className="count">{getCount(i)} 표</div>
                            </li>
                        ))}
                    </ul>
                </div>
                { isStart ? 
                    <Button onClick={onStop}>투표 종료</Button>
                : <Button onClick={onStart}>시작하기</Button> 
                }
            </Block>
        </>
    )
}
export default RoomPage;

const Block = styled.div`
    & .invite-code{
        display: flex;
        align-items: center;
        & span{
            margin: 0 10px;
            font-size: 25px; 
            cursor: pointer;
            color: #38e3a8;
        }
    }
    & .list{
        margin-top: 30px;
        &__title{
            font-size: 20px;
            & span{
                color: #38e3a8;
            }
        }
        &__wrap{
            margin-top: 10px;
            display: flex;
            flex-wrap: wrap;
            & li {
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                border: 1px solid white;
                margin: 10px;
                height: 80px;
                width: calc( 100%/3 - 20px );
                cursor: pointer;
                &.select{
                    border: 1px solid #38e3a8;
                    color: #38e3a8;
                    
                }
                & .count{
                    font-size: 12px;
                }
            }
        }

    }
`

const Button = styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    margin: 0 30px;
    justify-content: center;
    cursor: pointer;
    left: 0;
    border: 1px solid #38e3a8;
    color: #38e3a8;
    border-radius: 5px;
    margin-top: 10px;
    position: absolute;
    width: calc( 100% - 60px );
    bottom: 30px;
    transition: 0.3s;
    &:hover{
        background: #38e3a8;
        color: white;
    }
`

const down = keyframes`
    from {
        height: 0%;
    }
    to {
        height: 100%;
    }
`

const opacity = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const Modal = styled.div<{subject: string}>`
    position: fixed;
    background: ${props=>props.subject==="lier" ? "#ff6f6e" : "#38e3a8"};
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    z-index: 99;
    animation: ${down} 1.5s ease;
    & .title{
        &__sub{
            animation: ${opacity} 3s ease;
            font-size: 25px;
            font-weight: regular;
        }
        &__main{
            animation: ${opacity} 3s ease;
            font-size: 80px;
            font-weight: bold;
        }
    }
    & .close{
        position: absolute;
        right: 10px;
        top: 10px;
        width: 45px;
        height: 45px;
        font-size: 20px;
        border-radius: 50%;
        border: 1px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
`