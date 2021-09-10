import { useEffect } from "react";
import { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import styled from '@emotion/styled';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {
    code: string
}
   
const RoomPage: FC<RouteComponentProps<Props>> = ({match}) => {
    const { code } = match.params;
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
                <div className="list__title">접속 현황 (<span> 30 </span> 명)</div>
                <ul className="list__wrap">
                    <li>은결</li>
                    <li>은성</li>
                    <li>정민</li>
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