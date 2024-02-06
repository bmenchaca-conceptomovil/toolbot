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

  let optionCounter = 1; 

  const addOption = () => {
    setMessages((prevMessages) => {
      const newOptions = [
        {
          id: `${optionCounter}.1`,
          title: `Option 1`,
          description: " ",
        },
        {
          id: `${optionCounter}.2`,
          title: `Option 2`,
          description: " ",
        },
      ];

      const newMessage = {
        id: messages.messages.length + 1,
        type: "option",
        keyword: "",
        data: {
          from: "5215552624983",
          to: "527295465229",
          type: "option",
          listMessages: {
            headerText: " ",
            body: " ",
            footer: " ",
            buttonText: " ",
            sections: [
              {
                messages: newOptions,
              },
            ],
          },
          preview_url: false,
        },
        prev: prevMessages.messages[prevMessages.messages.length - 1].id.toString(),
        next: (prevMessages.messages.length + 1).toString(),
      };

      optionCounter += 2;

      return {
        ...prevMessages,
        messages: [...prevMessages.messages, newMessage],
      };
    });
  };

  
  const deleteOption = (messageId, optionId) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      messages: prevMessages.messages.map((message) => {
        if (message.id === messageId && message.data.listMessages.sections) {
          const newSections = message.data.listMessages.sections.map((section) => ({
            ...section,
            messages: section.messages.filter((option) => option.id !== optionId),
          }));

          return {
            ...message,
            data: {
              ...message.data,
              listMessages: {
                ...message.data.listMessages,
                sections: newSections,
              },
            },
          };
        }
        return message;
      }),
    }));
  };


  const [lastOptionIndex, setLastOptionIndex] = useState(2);

  const addOptionInput = (messageId) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              data: {
                ...message.data,
                listMessages: {
                  ...message.data.listMessages,
                  sections: message.data.listMessages.sections.map((section) =>
                    section.messages
                      ? {
                          ...section,
                          messages: [
                            ...section.messages,
                            {
                              id: `${messageId}.${section.messages.length + 1}`,
                              title: `Option ${section.messages.length + 1}`,
                              description: " ",
                            },
                          ],
                        }
                      : section
                  ),
                },
              },
            }
          : message
      );
  
      return { ...prevMessages, messages: updatedMessages };
    });
  };  
  
  //guardar info sin confirmacion
  const saveMessagesToLocalStorage = () => {
    localStorage.setItem('messages', JSON.stringify(messages));
  };

  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    saveMessagesToLocalStorage();
  }, [messages]);
  

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
    setEditedMessage(editedMessages[messageId] || (messageToEdit && messageToEdit.data.text) || "");
  };

  const stopEditing = () => {
    setIsEditing(false);
    setSelectedMessageId(null);
  };

  /*const editMessage = () => {
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
  
      setEditedMessages((prevEditedMessages) => ({
        ...prevEditedMessages,
        [selectedMessageId]: editedText,
      }));
  
      setIsDropdownVisible(false);
    }
  
    stopEditing();
  };*/
  

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
    console.log("handleOptionInputChange called with messageId:", messageId, "optionId:", optionId, "value:", value);
  
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              data: {
                ...message.data,
                listMessages: {
                  ...message.data.listMessages,
                  options: (message.data.listMessages.options || []).map((option) =>
                    option.id === optionId
                      ? {
                          ...option,
                          messages: option.messages.map((msg) =>
                            msg.id === 1 ? { ...msg, title: value } : msg
                          ),
                        }
                      : option
                  ),
                },
              },
            }
          : message
      );
  
      return { ...prevMessages, messages: updatedMessages };
    });
  };   
  
  const saveOptionDescription = (messageId, sectionIndex, optionIndex, value) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              data: {
                ...message.data,
                listMessages: {
                  ...message.data.listMessages,
                  sections: message.data.listMessages.sections.map((section, index) =>
                    index === sectionIndex
                      ? {
                          ...section,
                          messages: section.messages.map((option, optIndex) =>
                            optIndex === optionIndex
                              ? {
                                  ...option,
                                  description: value,
                                }
                              : option
                          ),
                        }
                      : section
                  ),
                },
              },
            }
          : message
      );
  
      return { ...prevMessages, messages: updatedMessages };
    });
  };

  //Funciones para añadir Servicio
  const addService = () => {
    const lastMessage = messages.messages[messages.messages.length - 1];
    const newService = {
      id: lastMessage.id + 1,
      type: "service",
      keyword: "",
      data: {
        from: "5215552624983",
        to: "527295465229",
        type: "service",
        service: {
          title: `Service ${lastMessage.id}`,
          services: Array.from({ length: 2 }, (_, index) => ({
            id: index + 1,
            title: `Service ${index + 1}`,
            messages: [
              //primeros dos son los selectores
              {
                id: `${index + 1}.1`,
                title: `Select ${index + 1}`,
                value: "Status 200",
              },
              {
                id: `${index + 1}.2`,
                title: `Select ${index + 2}`,
                value: "Status 500",
              },
              //inputs
              {
                id:`${index + 1}.3`,
                title:"Name",
                value:"",
              },
              {
                id:`${index + 1}.4`,
                title:"Method",
                value:"",
              },
              {
                id:`${index + 1}.5`,
                title:"URL",
                value:"",
              }
            ],
          })),
        },
        preview_url: false,
      },
      prev: messages.messages[messages.messages.length - 1].id.toString(),
      next: (messages.messages.length + 2).toString(),
    };
  
    setMessages({
      messages: [...messages.messages, newService],
    });
  };

  const handleServiceSelectChange = (messageId, serviceId, selectedValue) => {
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      const serviceIndex = newMessages.messages.findIndex((msg) => msg.id === messageId);
  
      if (serviceIndex !== -1) {
        const service = newMessages.messages[serviceIndex].data.service.services.find(
          (s) => s.id === serviceId
        );
  
        if (service) {
          service.messages[0].value = selectedValue;
          return newMessages;
        }
      }
      return prevMessages;
    });
  };
  
  //manejo de estado para los Inputs de servicio
  const [inputService, setInputService] = useState({
    key: "",
    method: "",
    url: "",
  });

  const handleServiceInputChange = (messageId, serviceIndex, inputIndex, value) => {
    console.log("handleServiceInputChange called with messageId:", messageId, "serviceIndex:", serviceIndex, "inputIndex:", inputIndex, "value:", value);

    setMessages((prevMessages) => {
     
      if (!Array.isArray(prevMessages)) {
        console.error("prevMessages is not an array:", prevMessages);
        return prevMessages;
      }

      const updatedMessages = prevMessages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              data: {
                ...message.data,
                service: {
                  ...message.data.service,
                  services: message.data.service.services.map((service, index) =>
                    index === serviceIndex
                      ? {
                          ...service,
                          messages: service.messages.map((msg, i) =>
                            i === inputIndex ? { ...msg, value: value } : msg
                          ),
                        }
                      : service
                  ),
                },
              },
            }
          : message
      );

      console.log("Updated messages:", updatedMessages);

      return updatedMessages;
    });

    setInputService((prevInputService) => ({
      ...prevInputService,
      [inputIndex === 0 ? "key" : inputIndex === 1 ? "method" : "url"]: value,
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

      <div className="mt-4 pb-20">
        {messages.messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2.5 mt-2">
            <div className="flex flex-col max-w-[420px] w-[420px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{message.data.from}</span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.data.type}</span>
              </div>

              {message.type === "option" && (
                <div className="mt-3 space-y-2">
                  {message.data.listMessages.sections && message.data.listMessages.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      {section.messages && section.messages.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">{option.title}:</label>
                          <input
                            type="text"
                            defaultValue={option.messages && option.messages[0] ? option.messages[0].title : ""}
                            onBlur={(e) => {
                              handleOptionInputChange(message.id, option.id, e.target.value);
                              saveOptionDescription(message.id, sectionIndex, optionIndex, e.target.value);
                            }}
                            className="border rounded p-2 w-42"
                          />
                          <button className="px-5 h-[2.5rem] text-white bg-red-500 rounded" onClick={() => deleteOption(message.id, option.id)}>
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Div para servicios */}
              {message.type === "service" && (
                <div className="flex flex-col max-w-[420px] w-[420px]">
                    {message.data.service.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center mt-2 mb-4">
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">
                          {service.title}:
                        </label>
                        <div className="flex items-center space-x-2">
                          <select
                            value={(service.messages[0] && service.messages[0].value) || ""}
                            onChange={(e) => handleServiceSelectChange(message.id, service.id, e.target.value)}
                            className="border rounded p-2 ml-2"
                            style={{ width: "13rem" }}
                          >
                            <option value="Option1">next id</option>
                            <option value="Option2">prev id</option>
                          </select>
                          {/* Botón verde sin función */}
                          <button className="px-5 h-[2.5rem] text-white bg-green-500 rounded">Status</button>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center mb-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-white mr-6">Name:</label>
                      <input
                        type="text"
                        //value={(message.data.service.services[2]?.messages[0]?.value) || ""}
                        value={inputService.name}
                        onChange={(e) => handleServiceInputChange(message.id, 2, 0, e.target.value)}
                        className="border rounded p-2 w-42 ml-2"
                      />
                    </div>
                    <div className="flex items-center mb-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-white mr-3">Method:</label>
                      <input
                        type="text"
                        //value={(message.data.service.services[2]?.messages[1]?.value) || ""}
                        value={inputService.method}
                        onChange={(e) => handleServiceInputChange(message.id, 2, 1, e.target.value)}
                        className="border rounded p-2 w-42 ml-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="text-sm font-semibold text-gray-900 dark:text-white mr-8">URL:</label>
                      <input
                        type="text"
                        //value={(message.data.service.services[2]?.messages[2]?.value) || ""}
                        value={inputService.url}
                        onChange={(e) => handleServiceInputChange(message.id, 2, 2, e.target.value)}
                        className="border rounded p-2 w-42 ml-3"
                      />
                    </div>


                </div>
              )}

              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                {isEditing && selectedMessageId === message.id ? (
                  //Cambio
                  <textarea
                  value={editedMessages[message.id] !== undefined ? editedMessages[message.id] : message.data.text}
                  onChange={(e) => {
                    const newText = e.target.value;
                
                    setMessages((prevMessages) => ({
                      ...prevMessages,
                      messages: prevMessages.messages.map((msg) =>
                        msg.id === message.id
                          ? { ...msg, data: { ...msg.data, text: newText } }
                          : msg
                      ),
                    }));
                
                    setEditedMessages((prevEditedMessages) => ({
                      ...prevEditedMessages,
                      [message.id]: newText,
                    }));
                  }}
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
                  {/* Elimincion de opcion guardar y guardadao automático*/}

                  <a
                    href="javascript:void(0)"
                    onClick={() => startEditing(message.id)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Editar
                  </a>
                </li>

                <li>
                  <a href="javascript:void(0)" onClick={() => toggleMessageStatus(message.id)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Finalizar
                  </a>
                </li>
                {message.type === "option" && (
                  <li>
                    <a href="javascript:void(0)" onClick={() => addOptionInput(message.id)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
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
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" onClick={addService}>
            <CloudIcon className="w-7 h-7 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Servicio</span>
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
