import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Accounts } from '@randlabs/myalgo-connect';
import algosdk from "algosdk"
import { connection, algodClient } from './utils/connections';

import './App.scss';

import ParamsProvider from "./context/paramsContext";
import AccountsProvider from "./context/accountsContext";
import Navbar from './components/bars/Navbar';
import Footer from './components/bars/Footer';
import Connect from './components/Connect';
import Payment from './components/operations/payment';

let timeoutResolution: NodeJS.Timeout | null = null;

export default function App(): JSX.Element {

    const [ params, setParams ] = useState<algosdk.SuggestedParams>();
    const [ accounts, setAccounts ] = useState<Accounts[]>([]);

    const onCompleteConnect = (accounts: Accounts[]): void => {
        setAccounts(accounts);
    };

    const getTransactionParams = async (): Promise<void> => {
        try {
            const params = await algodClient.getTransactionParams().do();
            setParams(params);
        }
        catch (err) {
            console.log(err);
        }
        timeoutResolution = setTimeout(getTransactionParams, 10000);
    }

    useEffect(() => {
        if (timeoutResolution)
            clearTimeout(timeoutResolution);
        getTransactionParams();
    }, [ accounts ])

    console.log(accounts, params)

    return (
        <Fragment>
            <Navbar />
            <Container className="main-container" fluid>
                <Row className="main-row">
                    <Col>
                        <Connect
                            connection={connection}
                            onComplete={onCompleteConnect}
                        />
                        {
                            accounts.length > 0 && params &&
                            <ParamsProvider params = {params}>
                                <AccountsProvider accounts = {accounts}>
                                    <Payment />
                                </AccountsProvider>
                            </ParamsProvider>
                        }
                    </Col>
                </Row>
            </Container>
            <Footer />
        </Fragment>
    );
}
