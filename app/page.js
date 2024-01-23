"use client";
import { useState, useRef, useEffect } from 'react';
import { ChatBubbleBottomCenterTextIcon, DevicePhoneMobileIcon, CloudIcon, WalletIcon, SquaresPlusIcon, FilmIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function Home() {

  const exportToJson = () => {
    const messagesObject = {};
    messages.messages.forEach((message, index) => {
      messagesObject[index + 1] = message;
    });

    const jsonContent = JSON.stringify({ bot_slug: messages.bot_slug, messages: messagesObject }, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bot_demo.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const publishJson = () => {
    const messagesObject = {};
    messages.messages.forEach((message, index) => {
      messagesObject[index + 1] = message;
    });

    const jsonString = JSON.stringify({ bot_slug: messages.bot_slug, messages: messagesObject }, null, 2);
    const escapedJsonString = jsonString
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');

    alert("Enviando datos ...");

    const blob = new Blob([jsonString], { type: 'application/json' });

    var formdata = new FormData();
    formdata.append("file", blob, "bot_demo.json");

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://prototipo-servicios.broadcastermobile.com/api/demo/bot/export", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [messages, setMessages] = useState({
    bot_slug: "",
    messages: [
      {
        keyword: "",
        id: 1,
        type: "message",
        data: {
          from: "5215552624983",
          to: "527295465229",
          type: "text",
          text: "Bienvenido al TOOLBOT",
          preview_url: false
        },
        prev: "0",
        next: "2"
      }
    ]
  });

  const addMessage = () => {
    const newMessage = {
      id: messages.messages.length + 1,
      type: "message",
      keyword: "",
      data: {
        from: "5215552624983",
        to: "527295465229",
        type: "text",
        text: "Nuevo mensaje",
        preview_url: false
      },
      prev: messages.messages[messages.messages.length - 1].id.toString(),
      next: (messages.messages.length + 2).toString()
    };
    setMessages({
      messages: [...messages.messages, newMessage]
    });
  };

  const addOption = () => {
    const newMessage = {
      id: messages.messages.length + 1,
      type: "option",
      keyword: "",
      data: {
        from: "5215552624983",
        to: "527295465229",
        type: "option",
        text: "Estas son las opciones",
        preview_url: false,
        options: [
          { id: 1, label: "Option 1", value: "", next: "1" },
          { id: 2, label: "Option 2", value: "", next: "1" },
        ],
      },
      prev: messages.messages[messages.messages.length - 1].id.toString(),
      next: (messages.messages.length + 2).toString()
    };
    setMessages({
      messages: [...messages.messages, newMessage]
    });
  };

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  const [messageStatus, setMessageStatus] = useState({});
  const [editedMessages, setEditedMessages] = useState({});

  const [isEditing, setIsEditing] = useState(false);

  const toggleDropdown = (messageId) => {
    setIsDropdownVisible(!isDropdownVisible);
    setSelectedMessageId(messageId);

    const messageToEdit = messages.messages.find((message) => message.id === messageId);

    setEditedMessage(editedMessages[messageId] || (messageToEdit && messageToEdit.data.text) || "");
    setIsEditing(false);
  };


  const deleteMessage = () => {
    if (selectedMessageId !== null) {
      setMessages({
        messages: messages.messages.filter((message) => message.id !== selectedMessageId),
      });
      setIsDropdownVisible(false);
    }
  };

  const toggleMessageStatus = (messageId) => {
    setMessageStatus((prevStatus) => ({
      ...prevStatus,
      [messageId]: !prevStatus[messageId],
    }));
  };

  const startEditing = (messageId) => {
    setIsEditing(true);
    setSelectedMessageId(messageId);
    const messageToEdit = messages.messages.find((message) => message.id === messageId);
    setEditedMessage(editedMessages[messageId] || messageToEdit.data.text);
  };

  const stopEditing = () => {
    setIsEditing(false);
    setSelectedMessageId(null);
  };

  const editMessage = () => {
    if (selectedMessageId !== null) {
      const editedText = editedMessages[selectedMessageId];

      if (editedText !== undefined && editedText.trim() !== "") {
        setMessages((prevMessages) => ({
          ...prevMessages,
          messages: prevMessages.messages.map((message) =>
            message.id === selectedMessageId
              ? { ...message, data: { ...message.data, text: editedText } }
              : message
          ),
        }));
      }

      setIsDropdownVisible(false);
    }

    stopEditing();
  };

  const setBotSlug = () => {
    const promptValue = prompt("Ingresa el valor para bot_slug:");
    if (promptValue !== null) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        bot_slug: promptValue,
      }));
    }
  };

  const toggleKeyword = (messageId) => {
    const promptValue = prompt("Ingresa el valor para keyword:");
    const keywordValue = promptValue !== null ? promptValue : "";
    setMessages((prevMessages) => ({
      ...prevMessages,
      messages: prevMessages.messages.map((message) =>
        message.id === messageId
          ? { ...message, keyword: keywordValue }
          : message
      ),
    }));
  };

  const handleOptionInputChange = (messageId, optionId, value) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      messages: prevMessages.messages.map((message) =>
        message.id === messageId
          ? {
            ...message,
            data: {
              ...message.data,
              options: message.data.options.map((option) =>
                option.id === optionId ? { ...option, value } : option
              ),
            },
          }
          : message
      ),
    }));
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-14">
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-2">
          <a href="#" className="flex items-center rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Toolbot</span>
          </a>


          <div className="flex md:order-2 space-x-2 md:space-x-2 rtl:space-x-reverse mt-1">
            <button
              type="button"
              className="flex items-center justify-center px-5 h-[2.5rem] text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 group hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={exportToJson}
            >
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-500">Exportar</span>
              <ArrowDownTrayIcon className="w-6 h-6 ml-2 text-gray-900 dark:text-gray-900 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            </button>
            <button
              type="button"
              className="px-5 h-[2.5rem] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={publishJson}
            >
              Publicar
            </button>
            <button
              type="button"
              className="px-5 h-[2.5rem] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={setBotSlug}
            >
              Detalles
            </button>
          </div>
        </div>
      </nav>

      <div className="mt-4">
        {messages.messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2.5 mt-2">
            <div className="flex flex-col max-w-[420px] w-[420px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{message.data.from}</span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.data.type}</span>
              </div>
              {message.type === "option" && (
                <div className="mt-3 space-y-2">
                  {message.data.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-white">{option.label}:</label>
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => handleOptionInputChange(message.id, option.id, e.target.value)}
                        className="border rounded p-2 w-42"
                      />
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                {isEditing && selectedMessageId === message.id ? (
                  <textarea
                    value={editedMessages[message.id] !== undefined ? editedMessages[message.id] : message.data.text}
                    onChange={(e) =>
                      setEditedMessages((prevEditedMessages) => ({
                        ...prevEditedMessages,
                        [message.id]: e.target.value,
                      }))
                    }
                    className="w-full border rounded p-2"
                  />
                ) : (
                  message.data.text
                )}
              </p>

              <span className={`text-sm font-normal text-red-500 dark:text-gray-400 ${messageStatus[message.id] ? '' : 'hidden'}`}>
                Finalizada
              </span>
            </div>
            <button
              id={`dropdownMenuIconButton_${message.id}`}
              onClick={() => toggleDropdown(message.id)}
              className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
              type="button"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            </button>
            <div
              id={`dropdownDots_${message.id}`}
              className={`z-10 ${isDropdownVisible && selectedMessageId === message.id ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600`}
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <a href="javascript:void(0)" onClick={deleteMessage} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Eliminar
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" onClick={() => toggleKeyword(message.id)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Keyword
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    onClick={() => (isEditing ? editMessage() : startEditing(message.id))}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {isEditing && selectedMessageId === message.id ? "Guardar" : "Editar"}
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" onClick={() => toggleMessageStatus(message.id)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Finalizar
                  </a>
                </li>
                {message.type === "option" && (
                  <li>
                    <a href="javascript:void(0)" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Agregar
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-5 gap-10 mx-auto font-medium">
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" onClick={addMessage}
          >
            <ChatBubbleBottomCenterTextIcon className="w-7 h-7 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Mensaje</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <CloudIcon className="w-7 h-7 mb-2 text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Servicio</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <WalletIcon className="w-7 h-7 mb-2 text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Variables</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" onClick={addOption}>
            <SquaresPlusIcon className="w-7 h-7 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Opciones</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <FilmIcon className="w-7 h-7 mb-2 text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Multimedia</span>
          </button>
        </div>
      </div>
    </main>
  );
}
