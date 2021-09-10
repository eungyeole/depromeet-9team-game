import { useEffect, useRef } from "react";
import { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import styled from '@emotion/styled';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as StompJs from '@stomp/stompjs';
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useState } from "react";
import roomAPI from '../libs/apis/room';


interface Props {
    code: string,
    name: string,
}
   
const RoomPage: FC<RouteComponentProps<Props>> = ({match}) => {
    const [users, setUsers] = useState<string[]>([]);
    const { code, name } = match.params;
    const stompClient = useRef<any>(null);
    function connect(){
        const ws = new SockJS("http://211.38.86.92:8010/websocket");
        stompClient.current = Stomp.over(ws);
        stompClient.current.connect({}, onConnected, (msg: any)=>console.log(msg))
    }
    function onConnected(){
        stompClient.current.subscribe(`/sub/chatroom/${code}`, (msg: any)=>console.log(msg));
        stompClient.current.publish({
            destination: `/pub/chatroom/${code}`,
            body: name,
        })
    }
    useEffect(()=>{
        connect();
        (async()=>{
            const { data } = await roomAPI.getUsers(code);
            setUsers(data);
        })()
        
        return () => stompClient.current.disconnect();
    },[])
    return(
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
                    {users.map((i)=><li>{i}</li>)}
                </ul>
            </div>
            <Button>시작하기</Button>
        </Block>
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
            display: flex;
            flex-direction: column;
        }

    }
`

const Button = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 0;
    justify-content: center;
    cursor: pointer;
    left: 0;
    border: 1px solid #38e3a8;
    color: #38e3a8;
    border-radius: 5px;
    margin-top: 10px;
    position: absolute;
    width: 100%;
    bottom: 30px;
    transition: 0.3s;
    &:hover{
        background: #38e3a8;
        color: white;
    }
`