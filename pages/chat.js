import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { IconButton } from 'material-ui';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaMensagens, setListaMensagens] = React.useState([]);
    
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5MTc2MiwiZXhwIjoxOTU4ODY3NzYyfQ.0s94a1pQkHBFpUmrkH59jfn_WlSqsSrwVUY7LHmCB8U';
    const SUPABASE_URL = 'https://uynivsmapocxtkefgnip.supabase.co';
    const supabaseClient =createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    React.useEffect(()=>{
    const dadosSupa =supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', { ascending: false})
        .then(({data,})=>{
            setListaMensagens(data)
            console.log("dados da consulta", data);
        })
    }, []);

    const handleNovaMensagem= (novaMensagem) =>{
        const mensagem = {
            de: 'aguidoDev',
            texto: novaMensagem,
        };

        supabaseClient
        .from('mensagens')
        .insert([
            mensagem
        ])
        .then(({ data })=>{
            setListaMensagens([
                data[0],
                ...listaMensagens,
            ]);
        });
        setMensagem('');
    }


    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(https://www.itl.cat/pngfile/big/85-850700_10-latest-all-anime-wallpaper-hd-full-hd.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '80%',
                    maxWidth: '65%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaMensagens}
                    onDelete={(id) => {
                        supabaseClient
                        .from('mensagens')
                        .delete()
                        .match({id})
                        .then((data)=>{
                            setListaMensagens(listaMensagens.filter((data) => {
                                    return data.id !== id
                            }))
                        })
                    }} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        < Button iconName = "arrowRight"
                            variant = 'tertiary'
                            colorVariant = 'neutral'
                            onClick={(e)=>{
                                handleNovaMensagem(mensagem)
                            }}
                        />
                        <input accept = "image/*"
                        id = "icon-button-file"
                        type = "file"
                        style = {
                            {
                                display: 'none'
                            }
                        }
                        />
                        <Button iconName = "file"
                            variant = 'tertiary'
                            colorVariant = 'neutral'
                            onClick={(e)=>{
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {

                return(
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        <Text
                            styleSheet={{
                                    fontSize: '14px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag = "strong"
                            >
                        <Box>
                                <Button
                                    type='button'
                                    label='X'
                                    styleSheet={{
                                        width: '30px',
                                        height: '33px',
                                        borderRadius: '10px 5px 10px 5px',
                                        backgroundColor: appConfig.theme.colors.primary[500],


                                    }}
                                    buttonColors={{
                                        contrastColor: appConfig.theme.colors.neutrals["000"],
                                        mainColor: appConfig.theme.colors.primary[500],
                                        mainColorLight: appConfig.theme.colors.primary[400],
                                        mainColorStrong: appConfig.theme.colors.primary[600],

                                    }}
                                    onClick={() => {
                                        props.onDelete(mensagem.id)
                                    }}
                                >X</Button>
                            </Box>
                                {mensagem.texto}    
                        </Text>
                                
                            
                    </Text>
                );
            })}
        </Box>
    )
}