import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [nomeCliente, setNomeCliente] = useState('');
    const [servico, setServico] = useState('');
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        fetchAgendamentos();
    }, []);

    const formatarDataHora = (dataISO, horario) => {
        const [ano, mes, dia] = dataISO.split('T')[0].split('-');
        const horarioFormatado = horario.split(':').slice(0, 2).join(':');
        return `${dia}/${mes}/${ano} às ${horarioFormatado}`;
    };

    const fetchAgendamentos = async () => {
        const response = await axios.get('http://localhost:5000/agendamentos');
        setAgendamentos(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editandoId) {
            await axios.put(`http://localhost:5000/agendamentos/${editandoId}`, {
                nome_cliente: nomeCliente,
                servico: servico,
                data: data,
                horario: horario
            });
        } else {
            await axios.post('http://localhost:5000/agendamentos', {
                nome_cliente: nomeCliente,
                servico: servico,
                data: data,
                horario: horario
            });
        }
        fetchAgendamentos();
        limparFormulario();
    };

    const handleEditar = (agendamento) => {
        setEditandoId(agendamento.id);
        setNomeCliente(agendamento.nome_cliente);
        setServico(agendamento.servico);
        setData(agendamento.data.split('T')[0]);
        setHorario(agendamento.horario.split(':').slice(0, 2).join(':'));
    };

    const handleExcluir = async (id) => {
        await axios.delete(`http://localhost:5000/agendamentos/${id}`);
        fetchAgendamentos();
    };

    const limparFormulario = () => {
        setEditandoId(null);
        setNomeCliente('');
        setServico('');
        setData('');
        setHorario('');
    };

    return (
        <div>
            <h1>Agendamentos - Impacta Barbearia</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome do Cliente"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Serviço"
                    value={servico}
                    onChange={(e) => setServico(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    required
                />
                <button type="submit">
                    {editandoId ? 'Atualizar' : 'Agendar'}
                </button>
                {/* {editandoId && (
                    <button type="button" onClick={limparFormulario}>
                        Cancelar Edição
                    </button>
                )} */}
            </form>
            <ul>
                {agendamentos.map((agendamento) => (
                    <li key={agendamento.id}>
                        {agendamento.nome_cliente} - {agendamento.servico} ({formatarDataHora(agendamento.data, agendamento.horario)})
                        <button onClick={() => handleEditar(agendamento)}>Editar</button>
                        <button onClick={() => handleExcluir(agendamento.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;