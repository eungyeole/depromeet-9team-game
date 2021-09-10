import styled from '@emotion/styled';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Selector from '../components/Selector';
interface RoomCreateData {
    topic: string,
    name: string,
}
const MainPage: FC = () => {
    const topics = ["게임", "음악"];
    const [loading, setLoading] = useState<boolean>(false);
    const [form, setForm] = useState<RoomCreateData>({
        name: "",
        topic: "게임",
    });
    const history = useHistory();
    const { topic, name } = form;
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form, 
            [name]: value
        })
    }
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
    }
    const onJoin = () => {
        if(name){
            const answer = prompt("초대코드를 입력하세요: ");
            answer && history.push(`/room/${answer}`);
        }
        else  alert("닉네임을 입력하세요!");   
    }
    return(
        <Block>
            <div className="title">
                <div className="title__name">🤑 <b>9조</b>를 벌었조</div>
                <b>'라이어'</b> 게임으로 친해지길 바라
                <div>In 디프만</div>
            </div>
            <Form onSubmit={onSubmit} className="">
                <input onChange={onChangeHandler} value={name} name="name" placeholder="닉네임을 입력해주세요."></input>
                <Selector name="topic" topics={topics} value={topic} onChange={onChangeHandler}></Selector>
                <button type="submit">
                    {loading && <LoadingSpinner/>}
                    방 만들기
                </button>
                <button onClick={onJoin} type="button" className="outer">초대코드로 입장</button>
            </Form>
        </Block>
    )
}
export default MainPage;


const Block = styled.div`
    padding-top: 80px;
    & .title{
        font-weight: 500;
        font-size: 30px;
        &__name{
            font-weight: 700;
            font-size: 50px;
            
        }
        & b{
            color: #38e3a8;
        }
    }
`


const Form = styled.form`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    & input{
        outline: none;
        border: 1px solid #38e3a8;
        color: #38e3a8;
        background: transparent;
        padding: 10px;
        &::placeholder{
            color: #38e3a8;
        }
    }
    & select{
        outline: none;
        margin-top: 10px;
        width: 100px;
        margin-left: auto;
        border: 1px solid #38e3a8;
        background: transparent;
        color: #38e3a8;
        padding: 5px;
        border-radius: 5px;
        cursor: pointer;
    }
    & button{
        outline: none;
        border: none;
        display: flex;
        background: transparent;
        align-items: center;
        height: 50px;
        font-size: 14px;
        justify-content: center;
        cursor: pointer;
        border: 1px solid #38e3a8;
        background:#38e3a8;
        margin: 0 30px;
        color: white;
        left: 0;
        border-radius: 5px;
        margin-top: 20px;
        width: calc( 100% - 60px );
        & svg{
            width: 30px;
        }
        transition: 0.3s;
        position: absolute;
        bottom: 100px;
        &.outer{
            background: transparent;
            color: #38e3a8;
            bottom: 30px;
        }
    }
    
`