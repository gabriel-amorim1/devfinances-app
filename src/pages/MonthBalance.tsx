import '../styles/month-balance.css';

/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';

import { FinancialTransactionInterface } from '../interfaces/FinancialTransaction';
import { FinancialTransactionModal } from '../components/FinancialTransactionModal/FinancialTransactionModal';
import api from '../services/api';
import editImg from '../assets/images/edit.svg';
import expenseImg from '../assets/images/expense.svg';
import { formatCurrency } from '../utils/format';
import incomeImg from '../assets/images/income.svg';
import logoImg from '../assets/images/logo.svg';
import minusImg from '../assets/images/minus.svg';
import totalImg from '../assets/images/total.svg';

export function MonthBalance() {
    const [transactionType, setTransactionType] = useState('');
    const [transaction, setTransaction] = useState({} as FinancialTransactionInterface);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [financialTransactions, setFinancialTransactions] = useState([] as FinancialTransactionInterface[]);
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [descriptionFilter, setDescriptionFilter] = useState('');
    const [loadFinancialTransactions, setLoadFinancialTransactions] = useState(true);

    useEffect(() => {
        if (loadFinancialTransactions) {
            let params = {};
        
            const date = new Date();
            const currentStartDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
            const currentEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
            
            params = {
                dateFilter: 'date',
                startDateFilter: currentStartDate,
                endDateFilter: currentEndDate,
            };
            
            api.get('financial-transactions', { params }
            ).then(res => {
                setFinancialTransactions(res.data.data);
                setStartDateFilter(currentStartDate);
                setEndDateFilter(currentEndDate);
                setLoadFinancialTransactions(false);
            });
        };
    });

    function handleFillTransaction(operationType: string, transaction?: FinancialTransactionInterface) {
        if (operationType === 'update' && transaction) setTransaction(transaction)
    }

    function handleModalType(operationType: string, transaction?: FinancialTransactionInterface) {
        handleFillTransaction(operationType, transaction);
        setTransactionType(operationType);
        openModal();
    }

    function removeTransaction(transactionId: string) {
        api.delete(`financial-transactions/${transactionId}`).then(res => {
            if (res.status === 204) {
                api.get('financial-transactions').then(res => setFinancialTransactions(res.data.data));
            }
        });
    };

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    function handleClearFilters() {
        let params = {};
        
        const date = new Date();
        const currentStartDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const currentEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
        
        params = {
            dateFilter: 'date',
            startDateFilter: currentStartDate,
            endDateFilter: currentEndDate,
        };

        api.get('financial-transactions', { params }
        ).then(res => {
            setFinancialTransactions(res.data.data);
            setStartDateFilter(currentStartDate);
            setEndDateFilter(currentEndDate);
            setDescriptionFilter('');
        });
    }

    function handleApplyFilters() {
        const params = {
            dateFilter: 'date',
            startDateFilter,
            endDateFilter,
            description: descriptionFilter,
        };

        api.get('financial-transactions', { params }
        ).then(res => {
            setFinancialTransactions(res.data.data);
        });
    }

    return (
        <div>
            <header>
                <img src={logoImg} alt="Logo Dev Finance" />
            </header>

            <main className="container">
                <section id="filters">
                    <h3>Filtros</h3>

                    <div className="filters-content">
                        <div className="input-group filter">
                            <label htmlFor="date">Data Inicial</label>
                            <input type="date" id="initial-date-filter" name="startDateFilter" value={startDateFilter} onChange={e => setStartDateFilter(e.target.value)} />
                        </div>

                        <div className="input-group filter">
                            <label htmlFor="date">Data Final</label>
                            <input type="date" id="final-date-filter" name="endDateFilter" value={endDateFilter} onChange={e => setEndDateFilter(e.target.value)} />
                        </div>

                        <div className="input-group filter">
                            <label htmlFor="description">Descrição</label>
                            <input 
                                type="text"
                                id="description-filter" 
                                name="description" 
                                placeholder="Descrição" 
                                value={descriptionFilter} 
                                onChange={e => setDescriptionFilter(e.target.value)} 
                            />
                        </div>

                        <div className="input-group filter">
                            <button type="button" onClick={handleClearFilters} className="button cancel filters">Limpar</button>
                        </div>

                        <div className="input-group filter">
                            <button type="button" onClick={handleApplyFilters}>Filtrar</button>
                        </div>
                    </div>
                </section>

                <section id="balance">
                    <h2 className="sr-only">Balanço</h2>

                    <div className="card">
                        <h3>
                            <span>Entradas</span>
                            <img src={incomeImg} alt="Imagem de Entradas" />
                        </h3>
                        <p id="incomeDisplay">R$ 0,00</p>
                    </div>

                    <div className="card">
                        <h3>
                            <span>Saídas</span>
                            <img src={expenseImg} alt="Imagem de Saídas" />
                        </h3>
                        <p id="expenseDisplay">R$ 0,00</p>
                    </div>

                    <div className="card total">
                        <h3>
                            <span>Total</span>
                            <img src={totalImg} alt="Imagem de Total" />
                        </h3>
                        <p id="totalDisplay">R$ 0,00</p>
                    </div>
                </section>

                <section id="transaction">
                    <h2 className="sr-only">Transações</h2>

                    <a href="#" onClick={() => {handleModalType('create')}} className="button new">+ Nova Transação</a>

                    <table id="data-table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Data</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {financialTransactions.map(transaction => {
                                const CSSclass = transaction.amount > 0 ? "income" : "expense"
                                const amount = formatCurrency(transaction.amount);
                                
                                return (
                                    <tr key={transaction.id}>
                                        <td className="description">{transaction.description}</td>
                                        <td className={CSSclass}>{amount}</td>
                                        <td className="date">{transaction.date}</td>
                                        <td>
                                            <button className='icon-button' onClick={() => {handleModalType('update', transaction)}}>
                                                <img src={editImg} alt="Editar transação" />
                                            </button>
                                        </td>
                                        <td>
                                            <button className='icon-button' onClick={() => {removeTransaction(transaction.id)}}>
                                                <img src={minusImg} alt="Remover transação" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            </main>

            <FinancialTransactionModal show={modalIsOpen} transactionType={transactionType} handleClose={closeModal} handleLoad={setLoadFinancialTransactions} transaction={transaction} />

            <footer>
                <p>dev.finance$</p>
            </footer>
        </div>
    );
}