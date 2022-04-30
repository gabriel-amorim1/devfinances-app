import "./financial-transaction-modal.css";

import { FormEvent, useCallback, useEffect, useState } from "react";

import api from "../../services/api";
import { handleModalContent } from "./utils";

export function FinancialTransactionModal({ handleClose, show, transactionType, transaction, handleLoad, children }: any) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [showHideClassName, setShowHideClassName] = useState("modal-overlay");
    const [isTransactionLoaded, setIsTransactionLoaded] = useState(false);
    
    const handleModalIsOpen = useCallback((show: any) => {
        if (show) {
            setShowHideClassName("modal-overlay active"); 
        } else {
            setShowHideClassName("modal-overlay");
        }
    }, []);

    useEffect(() => {
        handleFillFields(transactionType);
        handleModalIsOpen(show)
    });

    function handleFillFields(transactionType: string) {
        if (transactionType === 'update' && !isTransactionLoaded) {
            fillFields(transaction);
        }
    }

    function fillFields(transaction: any) {
        setDescription(transaction.description);
        setAmount(transaction.amount);
        setDate(transaction.date);
        setIsTransactionLoaded(true);
    }

    function clearFields() {
        setDescription('');
        setAmount('');
        setDate('');
    }

    function validateFields() {
        if (
            description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === ""
        ) {
            return false;
        }
        
        return true;
    }

    function formatValues() {
        return {
            description,
            amount: Number(amount.replaceAll('.', '').replace(',','.')),
            date: date,
        }
    }

    function handleCloseModal() {
        clearFields();
        handleLoad(true);
        setIsTransactionLoaded(false);
        handleClose();
    }

    async function handleNewFinancialTransaction(e: FormEvent) {
        e.preventDefault();
        if (validateFields()) {
            const data = formatValues();
        
            try{
                if(transaction.id) {
                    api.put(`financial-transactions/${transaction.id}`, 
                        data,
                    ).then(() => {
                        clearFields();
                        handleLoad(true);
                        setIsTransactionLoaded(false);
                        handleClose();
                    });
                } else {
                    api.post('financial-transactions', 
                        data,
                    ).then(() => {
                        clearFields();
                        handleLoad(true);
                        setIsTransactionLoaded(false);
                        handleClose();
                    });
                }
            } catch (err: any) {
                console.log(err.message);
                alert('Erro ao cadastrar movimento, tente novamente.');
            }
        } else {
            alert('Por favor, preencha todos os campos!');
        }
    }

    return (
        <div className={showHideClassName}>
            <div className="modal">
                <div id="form">
                    <h2>{handleModalContent(transactionType).title}</h2>
                    <form onSubmit={handleNewFinancialTransaction}>
                        <div className="input-group">
                            <label className="sr-only" htmlFor="description">Descrição</label>
                            <input 
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Descrição"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="sr-only" htmlFor="amount">Valor</label>
                            <input 
                                type="text" 
                                step="0.01" 
                                id="amount" 
                                name="amount" 
                                placeholder="0,00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />

                            <small className="help">Use o sinal - (negativo) para despesas e , (vírgula) para casas
                                decimais</small>
                        </div>

                        <div className="input-group">
                            <label className="sr-only" htmlFor="date">Data</label>
                            <input 
                                type="date"
                                id="date"
                                name="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>

                        <div className="input-group actions">
                            <button type="button" onClick={handleCloseModal} className="button cancel">Cancelar</button>
                            <button type="submit" >{handleModalContent(transactionType).buttonText}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}