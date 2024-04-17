import { useEffect, useRef } from 'react';
import './App.css'
import { useState } from 'react';
// import websocket from 'websocket';
import { v4 as uuidv4 } from 'uuid';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'back-mein-chat-1.onrender.com';
function App() {

  // const WebSocketServer = websocket.server;
  // const WebSocketClient = websocket.client;
  // const WebSocketFrame = websocket.frame;
  // const WebSocketRouter = websocket.router;
  // const W3CWebSocket = websocket.w3cwebsocket;
  const [text, setText] = useState('');
  const [textSoFar, setTextSoFar] = useState([]);
  const [sendername, setSendername] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  let socketRef = useRef(null);

  // console.log(socket, " client")
  console.log(SERVER_URL, " SERVER_URL");

  useEffect(() => {
    // Connection opened
    let newUniqueId = null;
    if (uniqueId == '') {
      newUniqueId = uuidv4();
      setUniqueId(prev => newUniqueId);
    }
    socketRef.current = new WebSocket(`wss://${SERVER_URL}/`, 'echo-protocol');
    socketRef.current.addEventListener("open", (event) => {
      socketRef.current.send(JSON.stringify({ id: uniqueId ? uniqueId : newUniqueId, msg: "Hello Server man!", type: 'init' }));
    });

    // Listen for messages
    socketRef.current.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      const data = JSON.parse(event.data);
      setTextSoFar(prev => ([ ...prev, {...data} ]))
    });
  }, [])


  // const saveChatName = () => {
  //   const uniqueId = uuidv4();
  //   if(sendername == '' || sendername == ' '){
  //     alert('Enter proper chatname')
  //     return;
  //   }
  //   setUniqueId(prev => uniqueId)
  // }

  const sendText = () => {
    const textObj = { id: uniqueId, msg: text, time: new Date(), type: 'chat' };
    setTextSoFar(prev => [...prev, textObj]);
    socketRef.current.send(JSON.stringify(textObj))
  }

  // console.log(text, "text", textSoFar)

  return (
    <>
      <div className='bg-red-600 min-h-screen flex flex-col justify-center items-center gap-4'>
        {/* <div className='flex justify-center items-center gap-2'>
          <p className='w-fit bg-slate-200 text-slate-600 p-1 rounded-sm'>Enter Chat Name </p> 
          <input value={sendername} onChange={(e) => {setSendername(e.target.value)}} placeholder='Pingu' 
            className='italic p-1 rounded-sm'
          />
          <button className='rounded-md bg-slate-700 text-slate-200 px-4 py-1 disabled:bg-slate-300'
            onClick={saveChatName}
            disabled={uniqueId == '' ? false : true}
          >
            Save
          </button>
        </div> */}
        <hr></hr>
        <div className='bg-slate-200 rounded-md p-2 w-3/4 min-h-[80%] flex flex-col justify-start items-center gap-4'>
          <div className='min-h-48 w-full bg-white p-2 overflow-y-auto'>
            {textSoFar.length > 0 ?
              textSoFar.map((elem, index) => (
                <div key={index} className={`flex w-full items-center my-1 gap-2 ${elem.id == uniqueId ? 'justify-end' : 'justify-start'} bg-slate-100 rounded-md p-1`}>
                  <span className='text-md'>{elem.msg}</span>
                  <span className='text-[0.7rem]'> {new Date(elem.time).toLocaleDateString()}</span>
                </div>

              )) :
              ''
            }
          </div>
          <hr className='w-full border-[1px] border-slate-300'></hr>
          <div className='flex justify-end items-center mr-0 w-full gap-4'>
            <input placeholder='type...' value={text} onChange={(e) => setText(e.target.value)}
              className='w-full px-2 py-1 border-[1px] rounded-md border-slate-800'
            />
            <input value='Send' type='button' onClick={sendText} className='px-2 py-1 bg-slate-600 text-slate-200 rounded-sm' />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
