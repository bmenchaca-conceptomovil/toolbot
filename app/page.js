"use client";
import { useState, useRef, useEffect } from 'react';
import { ChatBubbleBottomCenterTextIcon, DevicePhoneMobileIcon, CloudIcon, WalletIcon, SquaresPlusIcon, FilmIcon, UserCircleIcon } from '@heroicons/react/24/solid';

export default function Home() {

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bienvenido al TOOLBOT.",
    }
  ]);

  const addMessage = () => {
    const newMessage = {
      id: messages.length + 1,
      text: "Nuevo mensaje",
    };
    setMessages([...messages, newMessage]);
  };

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  const [messageStatus, setMessageStatus] = useState({});
  const [editedMessages, setEditedMessages] = useState({});

  const [isEditing, setIsEditing] = useState(false);

  const toggleDropdown = (messageId) => {
    setIsDropdownVisible(!isDropdownVisible);
    setSelectedMessageId(messageId);
    setEditedMessage(editedMessages[messageId] || messages.find((message) => message.id === messageId).text);
    setIsEditing(false);
  };

  const deleteMessage = () => {
    if (selectedMessageId !== null) {
      setMessages(messages.filter((message) => message.id !== selectedMessageId));
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
  };

  const stopEditing = () => {
    setIsEditing(false);
    setSelectedMessageId(null);
  };

  const editMessage = () => {
    if (selectedMessageId !== null) {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === selectedMessageId
            ? { ...message, text: editedMessages[message.id] || message.text }
            : message
        )
      );
      setIsDropdownVisible(false);
    }
    stopEditing();
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-14">
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-2">
          <a href="#" className="flex items-center rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Toolbot</span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Exportar
            </button>
          </div>
        </div>
      </nav>

      <div className="mt-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2.5 mt-2">
            <div className="flex flex-col max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Bot</span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Mensaje</span>
              </div>
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                {isEditing && selectedMessageId === message.id ? (
                  <textarea
                    value={editedMessages[message.id] !== undefined ? editedMessages[message.id] : message.text}
                    onChange={(e) =>
                      setEditedMessages((prevEditedMessages) => ({
                        ...prevEditedMessages,
                        [message.id]: e.target.value,
                      }))
                    }
                    className="w-full border rounded p-2"
                  />
                ) : (
                  message.text
                )}
              </p>

              <span className={`text-sm font-normal text-red-500 dark:text-gray-400 ${messageStatus[message.id] ? '' : 'hidden'}`}>
                Finalizada</span>
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

              </ul>
            </div>
          </div>
        ))}


      </div>


      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-6 gap-10 mx-auto font-medium">
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" onClick={addMessage}
          >
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Mensaje</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <DevicePhoneMobileIcon className="w-6 h-6 mb-2 text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Teléfono</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <CloudIcon className="w-6 h-6 mb-2 text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Servicio</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <WalletIcon className="w-6 h-6 mb-2 text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Variables</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <SquaresPlusIcon className="w-6 h-6 mb-2 text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Opciones</span>
          </button>
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <FilmIcon className="w-6 h-6 mb-2 text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-300 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Multimedia</span>
          </button>
        </div>
      </div>

    </main>
  );
}
