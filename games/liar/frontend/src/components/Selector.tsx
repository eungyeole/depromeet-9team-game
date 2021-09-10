import { ChangeEvent, FC, useRef } from "react";
import styled from '@emotion/styled';

interface Props {
    topics: string[],
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
    value: string,
    name: string,
}
const Selector: FC<Props> = ({topics, value, name, onChange}) => {
    return(
        <Block value={value} name={name} onChange={onChange}>
            {topics.map((i, index)=><option key={index} value={i}>{i}</option>)}
        </Block>
            
    )
}
export default Selector;


const Block = styled.select`

    & select {
        display: none;
    }
`