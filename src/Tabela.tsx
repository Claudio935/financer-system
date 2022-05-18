import styled from "styled-components"
import React, { useEffect, useState } from "react";
import { dataPrincipal, dataCategory } from "./dados/financial-Data";
import moment from "moment";
import 'moment/locale/pt-br';
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";





export const TabelaFinanceira = () => {


    const [dadosTabela, setDadosTabela] = useState(dataPrincipal)
    const [monthNow, setMonthNow] = useState(moment())
    const [totalReceita, setTotalReceita] = useState(Number)
    const [totalDespesa, setTotalDespesa] = useState(Number)
    const [errorValor, setErrorValor] = useState("")
    const [errorData, setErrorData] = useState("")
    const [errorTitulo, setErrorTitulo] = useState("")
    const [errorTipo, setErrorTipo] = useState("")
    const [errorCategoria, setErrorCategoria] = useState("")
    const [date, setDate] = useState({
        data: moment().format("DD/MM/YYYY"),
        categoria: "",
        titulo: "",
        valor: "",
        tipo: ""
    })
    const handleClickChangeNextMonth = () => {
        setMonthNow(moment(monthNow.add(1, 'months')))
    }
    const handleClickChangePreviewMonth = () => {

        setMonthNow(moment(monthNow.subtract(1, 'months')))
    }
    const handleClick = () => {
        if (date.titulo === "" || date.data === "" || date.categoria === "" || date.tipo === ""|| date.valor === "") {
            setErrorTitulo(date.titulo === "" ? "adicione o titulo" : "")
            setErrorData( date.data === "" ? "adicione a data" : "")
            setErrorCategoria(date.categoria === "" ? "adicione a categoria" : "")
            setErrorTipo(date.tipo === "" ? "adicione o tipo" : "")
            setErrorValor(date.valor==="" ? "adicione o valor" : "")
            return
        }


        setDadosTabela([...dadosTabela, date])
    }

    useEffect(() => {
        setTotalReceita(dadosTabela.reduce((previousValue, currentValue) => moment(currentValue.data, 'DD/MM/YYYY').format("MMMM") === monthNow.format("MMMM") && currentValue.tipo === "Receita" ? previousValue + Number(currentValue.valor) : previousValue, 0))
        setTotalDespesa(dadosTabela.reduce((previousValue, currentValue) => moment(currentValue.data, 'DD/MM/YYYY').format("MMMM") === monthNow.format("MMMM") && currentValue.tipo === "Despesa" ? previousValue + Number(currentValue.valor) : previousValue, 0))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthNow, dadosTabela])
    const handleChangeData = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setDate({ ...date, data: moment(event.target.value).format("DD/MM/YYYY") })
        setErrorData("")
    }
    const handleChangeTitulo = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setDate({ ...date, titulo: event.target.value })
        setErrorTitulo("")
    }
    const handleChangeTipo = (event: React.ChangeEvent<HTMLSelectElement>) =>{
        setDate({ ...date, tipo: event.target.value })
        setErrorTipo("")
    }
    const handleChangeCategoria = (event: React.ChangeEvent<HTMLSelectElement>) =>{
        setDate({ ...date, categoria: event.target.value })
        setErrorCategoria("")
    }
  
    const mascaraMoney = (money = "") => {
        let inputMask = ""
        if (money.length > 0) {
            inputMask = `R$${money}`
        }
        return inputMask
    }

    const retirarMoney = (money = "") => {
        let inputMask = `${money.replace("R$", "")}`
        if (inputMask.length > 0 && !Number(inputMask)) {
            setErrorValor("O valor deve ser um numero")
            return ""
        }
        setErrorValor("")
        return inputMask
    }

    useEffect(() => {
        console.log()
    }, [date])


    return (
        <FinancerContainer>
            <SearchMonthBalance>
                <SearchMonth>
                    <AiFillCaretLeft onClick={handleClickChangePreviewMonth} />
                    <LabelData>
                        {monthNow.format('MMMM')}
                    </LabelData>
                    <AiFillCaretRight onClick={handleClickChangeNextMonth} />
                </SearchMonth>
                <ReceitaArea>
                    <LabelReceita>
                        Receita
                    </LabelReceita>
                    <ReceitaValue>
                        R$ {(totalReceita.toFixed(2))}
                    </ReceitaValue>
                </ReceitaArea>
                <DespesaArea>
                    <LabelDespesa>
                        Despesa
                    </LabelDespesa>
                    <DespesaValue>
                        R$ {(totalDespesa).toFixed(2)}
                    </DespesaValue>
                </DespesaArea>
                <BalancoArea>
                    <LabelBalanco>
                        Balanço
                    </LabelBalanco>
                    <BalancoValue style={totalReceita - totalDespesa > 0 ? {color:"green"}:{color:"red"}}>
                        R$ {(totalReceita - totalDespesa).toFixed(2)}
                    </BalancoValue>
                </BalancoArea>
            </SearchMonthBalance>
            <SearchArea>
                <AreaInput>
                    <Label htmlFor="data">Data</Label>
                    <Input value={moment(date.data, "DD/MM/YYYY").format('YYYY-MM-DD')} onChange={handleChangeData} id="data" type="date"></Input>
                    <TextAviso>{errorData}</TextAviso>
                </AreaInput>
                <AreaInput>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={date.categoria} id="categoria" name="select" onChange={handleChangeCategoria}>
                        <option value="" disabled hidden>Escolha a categoria</option>
                        {dataCategory.map((item, index) => {
                            return <option key={index} value={`${item.categoria}`}>{item.categoria}</option>
                        })}

                    </Select>
                    <TextAviso>{errorCategoria}</TextAviso>
                </AreaInput>
                <AreaInput>
                    <Label htmlFor="titulo">Titulo</Label>
                    <Input id="titulo" type="text" onChange={handleChangeTitulo}></Input>
                    <TextAviso>{errorTitulo}</TextAviso>
                </AreaInput>
                <AreaInput>
                    <Label htmlFor="valor">Valor</Label>
                    <Input
                        id="valor"
                        onChange={(e) => setDate({ ...date, valor: retirarMoney(e.target.value) })}
                        value={mascaraMoney(date.valor)}
                    ></Input>
                     <TextAviso>{errorValor}</TextAviso>
                </AreaInput>

                <AreaInput>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                        id="tipo"
                        value={date.tipo}
                        name="select"
                        onChange={handleChangeTipo}>
                        <option value="" disabled hidden>Escolha o tipo</option>
                        <option value={`Receita`}>Receita</option>
                        <option value={`Despesa`}>Despesa</option>
                    </Select>
                    <TextAviso>{errorTipo}</TextAviso>
                </AreaInput>
                <ButtonAdicionar onClick={handleClick} >Adicionar</ButtonAdicionar>
            </SearchArea>
            <Tabela>
                <TableHead>
                    <TableRow>
                        <Tabelaoption>Data</Tabelaoption>
                        <Tabelaoption>Categoria</Tabelaoption>
                        <Tabelaoption>Titulo</Tabelaoption>
                        <Tabelaoption>Valor</Tabelaoption>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dadosTabela.map((item, index) => {
                        if (moment(item.data, 'DD/MM/YYYY').format("MMMM") === monthNow.format("MMMM")) {
                            return <TableRow key={index}>
                                <Tabelaoption scope="row">{item.data}</Tabelaoption>
                                <TableDados key={`categoria${index}`}>{item.categoria}</TableDados>
                                <TableDados key={`titulo${index}`}>{item.titulo}</TableDados>
                                <TableDados style={item.tipo === "Receita"?{color:"green"}:{color:"red"}}  key={`valor${index}`}>R${item.valor}</TableDados>
                            </TableRow>
                        } else { return "" }
                    })}

                </TableBody>
            </Tabela>
        </FinancerContainer>
    )
}
const TableHead = styled.thead`
width: 100%;

`;
const Tabela = styled.table`
background-color: #fff;
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
width: 80%;
height:30px;
border-radius: 25px;
`;
const Tabelaoption = styled.th`
width:100%;
text-align: center;

`;
const TableRow = styled.tr`
display:flex;
justify-content: space-evenly;
width: 100%;
`;
const TableBody = styled.tbody`
width: 100%;
`;
const TableDados = styled.td`
width: 100%;
text-align: center;
`;
const Input = styled.input`
padding:5px 0px;
width: 60%;
`;
const LabelData = styled.label`
font-weight:bold;
font-size: 20px;
`;
const Select = styled.select`
padding:6px 0px;
width: 60%;
`;

const SearchMonth = styled.div`
height: 150px;
display: flex;
align-items: center;
`;
const Label = styled.label`
font-size: 12;
`
const SearchArea = styled.div`
display: flex;
flex-direction: row;
width: 80%;
padding: 40px 0px;
align-items: center;
justify-content: center;
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
margin:0px 0px 15px 0px;
border-radius: 25px;
`;
const AreaInput = styled.div`
position: relative;
display:flex;
flex-direction: column;
width:100%;
align-items: center;
justify-content: space-evenly;
`
const ButtonAdicionar = styled.button`
background:rgb(174, 215, 229);
padding:5px 40px;
margin: 19px 15px 0px 0px;

`;
const FinancerContainer = styled.div`
display: flex;
flex-direction: column;
width:100%;
align-items: center;

`;
const SearchMonthBalance = styled.div`
width: 80%;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-around;
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
margin:-45px 0px 15px 0px;
background-color:#fff;
border-radius: 25px;
`;
const ReceitaArea = styled.div`
display: flex;
flex-direction: column;
align-items: center;

`;
const DespesaArea = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;
const BalancoArea = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;
const LabelReceita = styled.label`
font-weight:bold;
`;
const LabelDespesa = styled.label`
font-weight:bold;
`;
const LabelBalanco = styled.label`
font-weight:bold;
`;
const DespesaValue = styled.label`
`;
const ReceitaValue = styled.label`
`;
const BalancoValue = styled.label`
`;
const TextAviso = styled.label`
font-size: 15px;
color: red;
position: absolute;
bottom:-15px;
width:100%;
display: flex;
justify-content: center;
`;