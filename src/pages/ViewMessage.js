
// import { FilledButton } from '../components/Buttons/FilledButton';
// import TopBar from '../components/TopBar';
import { useState, useRef, useContext  } from "react"
// import Select from '../components/Select';
import Path from '../components/Path';
import { PageContext } from "../context/PageContext";
// import Input  from '../components/Input'
function  DisplayMessage({messages}){
    // const [date, setDate] = useState('')
    const [currentDate, setCurrentDate] = useState(null);

    // Group messages by date
    const groupedMessages = messages.reduce((acc, message) => {
      const date = formatDate(message[3]);
      acc[date] = acc[date] || [];
      acc[date].push(message);
      return acc;
    }, {});
  
    return (
      <div className='py-5 h-[70vh] overflow-y-scroll'>
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            {date !== currentDate && (
              <div className='flex justify-center' ><p className='font-bold p-2 py-1 rounded-xl font-bold text-[12px] leading-[20px] tracking-[0.005em] text-white text-center bg-[#aaa] w-fit'>{date}</p></div>
            )}
            {groupedMessages[date].map((item, index) => (
               item[0] === 1 ? (
                <div className='flex gap-3 mb-2 items-center justify-end '>
                <div className='max-w-[40%] text-right font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey'>
                    <div className='p-5 bg-[#283618] rounded-[25px] mb-3 w-[100%] rounded-br-none text-white text-left text-black'>
                       {item[1]}
                    </div>
                    <svg width="20" className='inline mr-1' height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6884 6.69613L4.68837 13.5711C4.57147 13.6861 4.41407 13.7506 4.25009 13.7506C4.08612 13.7506 3.92871 13.6861 3.81181 13.5711L0.811812 10.625C0.753282 10.5675 0.706661 10.499 0.674611 10.4234C0.642562 10.3478 0.625711 10.2667 0.625022 10.1846C0.624333 10.1025 0.639818 10.0211 0.670594 9.94498C0.70137 9.86888 0.746834 9.79958 0.80439 9.74105C0.861946 9.68252 0.930467 9.6359 1.00604 9.60385C1.08161 9.5718 1.16276 9.55495 1.24485 9.55426C1.32693 9.55357 1.40835 9.56906 1.48445 9.59984C1.56055 9.63061 1.62984 9.67608 1.68837 9.73363L4.25009 12.2493L10.8126 5.80394C10.9309 5.6877 11.0905 5.62323 11.2564 5.62469C11.3385 5.62542 11.4197 5.64231 11.4953 5.67441C11.5709 5.7065 11.6394 5.75317 11.697 5.81176C11.7545 5.87034 11.8 5.93968 11.8307 6.01583C11.8615 6.09198 11.8769 6.17344 11.8762 6.25556C11.8755 6.33768 11.8586 6.41886 11.8265 6.49445C11.7944 6.57004 11.7477 6.63858 11.6892 6.69613H11.6884ZM19.1962 5.81176C19.1387 5.75313 19.0701 5.70642 18.9945 5.6743C18.9189 5.64217 18.8378 5.62526 18.7556 5.62454C18.6735 5.62381 18.592 5.63928 18.5159 5.67007C18.4397 5.70085 18.3704 5.74634 18.3118 5.80394L11.7493 12.2493L10.2782 10.8039C10.1599 10.6878 10.0003 10.6234 9.83453 10.625C9.66875 10.6265 9.51037 10.6938 9.39423 10.8121C9.2781 10.9305 9.21372 11.0901 9.21526 11.2558C9.21679 11.4216 9.28413 11.58 9.40244 11.6961L11.311 13.5711C11.4279 13.6861 11.5853 13.7506 11.7493 13.7506C11.9133 13.7506 12.0707 13.6861 12.1876 13.5711L19.1876 6.69613C19.2463 6.63865 19.293 6.57017 19.3252 6.4946C19.3574 6.41903 19.3744 6.33786 19.3752 6.25573C19.376 6.17359 19.3606 6.0921 19.3299 6.01592C19.2992 5.93974 19.2537 5.87037 19.1962 5.81176Z" fill="#329993"/>
                    </svg>
                        {item[2]}
                </div>
                <svg  className="" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="18" fill="#C4C4C4"/>
                    </svg>
                </div>
            ) : (
                <div className='flex gap-3 mb-2 items-center w-fit max-w-[40%]'>
                <svg  className="" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" fill="#C4C4C4"/>
                </svg>
                <div className='w-full font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey'>
                    <div className='p-5 bg-[#F9F9F9] mb-3 rounded-[25px] w-[100%] text-black rounded-bl-none'>
                        {item[1]}
                    </div>
                    {item[2]}
                </div>
                </div>
            )))}
            {/* {setCurrentDate(date)} */}
          </div>
        ))}
      </div>
    );
  }
  const AudioRecorder = ({audioBlob, setAudioBlob}) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);
  
    const handleStartRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks = [];
  
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
  
        mediaRecorder.onstop = () => {
          setIsRecording(false);
          const blob = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(blob);
        };
  
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };
  
    const handleStopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  
    const handleDeleteRecording = () => {
      setAudioBlob(null);
    };
  
  
    return (
      <div>
        {!audioBlob && !isRecording && (
          <button onClick={handleStartRecording}><i class="fa-solid fa-xl fa-microphone-lines" style={{color: '#BC6C25'}}></i></button>
        )}
        {isRecording && (
          <div>
            <button onClick={handleStopRecording}><i class="fa-solid fa-xl fa-microphone-lines-slash fa-beat-fade" style={{color: '#BC6C25'}}></i></button>
          </div>
        )}
        {audioBlob && (
          <div className='flex gap-2'>
            <audio ref={audioRef} controls src={URL.createObjectURL(audioBlob)} />
            <button onClick={handleDeleteRecording}><i class="fa-regular fa-trash-can fa-xl" style={{color: '#B22334'}}></i></button>
          </div>
        )}
      </div>
    );
  };
  
    
function isSameWeek(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    const d1Year = d1.getFullYear();
    const d2Year = d2.getFullYear();
  
    const d1Week = getWeekNumber(d1);
    const d2Week = getWeekNumber(d2);
  
    return d1Year === d2Year && d1Week === d2Week;
  }
  
  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceFirstDay = Math.round((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
    return weekNumber;
  }
  
  
  const FileUploader = ({ onFileUpload , setFileType, setSelectedFile}) => {
  
    // Trigger hidden file input when button is clicked
    const handleButtonClick = () => {
      document.getElementById('fileInput').click();
    };
  
    // Handle file selection
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      onFileUpload(file);
      checkFileType(file);
    };
    const checkFileType = (file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const result = e.target.result;
            
            if (result.startsWith("data:image/")) {
              // It's an image
              setFileType('image')
              // Here you can display the image or handle it as needed
            } else if (result.startsWith("data:video/")) {
              // It's a video
              setFileType('video')
              // Here you can display the video or handle it as needed
            } else {
              // It's neither an image nor a video
              setFileType('doc')
              // Handle other file types here
            }
          };
        // reader.onload = () => {
        //     console.log(reader.result)

        //     const fileType = reader.result.split(';')[0].split('/')[0];
        //     setFileType(fileType);
        // // };
        // reader.readAsDataURL(file);
    };
    return (
      <div className="file-uploader">
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button onClick={handleButtonClick} className="file-upload-button border-none">
            <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.3797 8.55805C14.4378 8.6161 14.4839 8.68503 14.5153 8.7609C14.5468 8.83678 14.563 8.91811 14.563 9.00024C14.563 9.08238 14.5468 9.16371 14.5153 9.23958C14.4839 9.31545 14.4378 9.38439 14.3797 9.44243L7.96949 15.8487C7.14888 16.6692 6.03592 17.1301 4.87547 17.13C3.71501 17.13 2.60212 16.6689 1.7816 15.8483C0.96109 15.0277 0.500171 13.9147 0.500244 12.7543C0.500317 11.5938 0.961376 10.4809 1.78199 9.6604L9.53668 1.79165C10.1225 1.20517 10.9174 0.87544 11.7464 0.875C12.5753 0.874561 13.3705 1.20345 13.957 1.78931C14.5435 2.37516 14.8732 3.17001 14.8736 3.99898C14.8741 4.82795 14.5452 5.62314 13.9593 6.20962L6.20309 14.0784C5.85085 14.4306 5.37311 14.6285 4.87496 14.6285C4.37682 14.6285 3.89908 14.4306 3.54684 14.0784C3.1946 13.7261 2.99671 13.2484 2.99671 12.7502C2.99671 12.2521 3.1946 11.7744 3.54684 11.4221L10.0547 4.81118C10.1117 4.75037 10.1803 4.70157 10.2564 4.66766C10.3326 4.63376 10.4147 4.61543 10.4981 4.61375C10.5814 4.61207 10.6642 4.62708 10.7417 4.6579C10.8191 4.68871 10.8896 4.73471 10.949 4.79318C11.0085 4.85165 11.0556 4.92141 11.0876 4.99836C11.1197 5.07531 11.136 5.1579 11.1356 5.24125C11.1353 5.32461 11.1183 5.40705 11.0856 5.48373C11.0529 5.56041 11.0052 5.62977 10.9453 5.68774L4.43668 12.3057C4.37841 12.3635 4.33209 12.4322 4.30038 12.508C4.26866 12.5837 4.25217 12.6649 4.25184 12.747C4.25152 12.8291 4.26736 12.9104 4.29847 12.9864C4.32958 13.0623 4.37535 13.1314 4.43317 13.1897C4.49098 13.248 4.5597 13.2943 4.63541 13.326C4.71113 13.3577 4.79234 13.3742 4.87443 13.3745C4.95652 13.3749 5.03786 13.359 5.11382 13.3279C5.18979 13.2968 5.25888 13.251 5.31715 13.1932L13.0726 5.32837C13.4249 4.97685 13.623 4.49981 13.6235 4.00218C13.6241 3.50455 13.4269 3.02709 13.0754 2.67485C12.7238 2.32261 12.2468 2.12444 11.7492 2.12392C11.2515 2.12341 10.7741 2.3206 10.4218 2.67212L2.66871 10.5377C2.37827 10.8277 2.14778 11.1721 1.99041 11.5511C1.83305 11.9302 1.75189 12.3365 1.75156 12.747C1.75123 13.1574 1.83175 13.5639 1.98851 13.9432C2.14527 14.3225 2.37521 14.6672 2.6652 14.9577C2.95518 15.2481 3.29954 15.4786 3.6786 15.636C4.05766 15.7933 4.464 15.8745 4.87443 15.8748C5.28486 15.8751 5.69133 15.7946 6.07064 15.6379C6.44995 15.4811 6.79467 15.2512 7.08512 14.9612L13.4961 8.55493C13.6137 8.43822 13.7728 8.37299 13.9385 8.37358C14.1042 8.37416 14.2629 8.44052 14.3797 8.55805Z" fill="#BC6C25"/>
                    </svg>
        </button>
      </div>
    );
  };
  
  
 
  function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (isSameWeek(date, today)) {
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return weekdays[date.getDay()];
    } else {
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options);
    }
  }
  
  
function ViewMessage() {
    const { changePage } = useContext(PageContext)
    const [fileType, setFileType] = useState(null);
    const [messages, setMessages] = useState([
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 20)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 20)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 20)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 25)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 25)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 25)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 25)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 25)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 25)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 28)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 28)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 28)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 28)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 28)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 28)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 28)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 29)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 29)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 29)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 29)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 29)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 29)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 29)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 3, 29)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 4, 2)],
        [0, 'Hey are you there', '10:55 am', new Date(2024, 4, 2)],
    ])
    
    const [audioBlob, setAudioBlob] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [text, setText] = useState('')
    function addMessageToArray(message) {
        // Create a date object with Central Time (CT) zone offset
        const currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
      
        // Convert the string back to a date object
        const dateObject = new Date(currentTime);
        let messageObject = []
        messageObject.push(1)
        messageObject.push(message)
        messageObject.push(dateObject.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase())
        messageObject.push(dateObject)
       setMessages((prev)=>[...prev, messageObject])
      }
    function handleSubmit(e) {
        e.preventDefault();
        if (text.trim()){
        addMessageToArray(text)
        }
        if (selectedFile) {
            handleFileUpload(selectedFile);
          }
        if (audioBlob) {
            addMessageToArray(<audio controls src={URL.createObjectURL(audioBlob)} />)
            setAudioBlob(null)
        }
        setText('')
      }
      const renderFilePreview = () => {
        if (!selectedFile) return null;
        
        // Image preview
        if (fileType === 'image') {
            setFileType(null)
            return (
                <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
            );
        }

        // Video preview
        if (fileType === 'video') {
            setFileType(null)
            return (
                <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
                    <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                </video>
            );
        }

        // Document preview (link to download)
        setFileType(null)
        return (
            <a href={URL.createObjectURL(selectedFile)} download={selectedFile.name}>
                {selectedFile.name}
            </a>
        );
    };

    const handleFileUpload = (file) => {
    if (file){

      addMessageToArray(renderFilePreview())}
      setSelectedFile(null)
      setFileType(null)
    };
    return (
    <div className='bg-[#F9F9FC] w-full px-4 py-5 '>
      {changePage('empty')}                                                 
      <div className='space-x-8 w-full flex mt-5'>
        <h1 className='font-black text-[20px] leading-[30px] tracking-[0.01em] text-[#333333]'>View Message</h1>
      </div>
      <div className='my-3 space-x-8 w-full mb-10 flex justify-between items-center'>
        <Path pages={[{name: 'Dashboard', link: ''}, {name: 'Messages', link: 'messages'}, {name: 'Stephen Okunola', link: 'view-messages'}]} />
      </div>
      <div className=' w-full rounded-xl my-6  p-3 bg-white px-[50px]'>
        <div className='flex justify-between items-center border-b py-4 '>
            <div className='flex gap-5 items-center'>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="25" fill="#D9D9D9"/>
            </svg>
            <div>
                <p className="h-[20px] font-bold text-[14px] leading-[20px] tracking-[0.0005em]">Stephen Okunola</p>
                <p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey">Okunola@gmail.com</p>
            </div>
            </div>
            <button>
                <p className="mr-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#BC6C25]"><svg width="24" className='inline' height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.9999 16.1698L5.5299 12.6998C5.34292 12.5129 5.08933 12.4078 4.8249 12.4078C4.56048 12.4078 4.30688 12.5129 4.1199 12.6998C3.93292 12.8868 3.82788 13.1404 3.82788 13.4048C3.82788 13.5358 3.85367 13.6654 3.90377 13.7864C3.95388 13.9073 4.02732 14.0173 4.1199 14.1098L8.2999 18.2898C8.6899 18.6798 9.3199 18.6798 9.7099 18.2898L20.2899 7.70983C20.4769 7.52286 20.5819 7.26926 20.5819 7.00483C20.5819 6.74041 20.4769 6.48681 20.2899 6.29983C20.1029 6.11286 19.8493 6.00781 19.5849 6.00781C19.3205 6.00781 19.0669 6.11286 18.8799 6.29983L8.9999 16.1698Z" fill="#BC6C25"/>
                </svg> Resolve Chat</p>
            </button>
        </div>
        <DisplayMessage messages={messages}/>
        <form onSubmit={handleSubmit} className='border-2 rounded-xl mt-5'>
            <div className='p-3 px-5 border-b flex'>
                <input placeholder={`Write a message`} value={text} onChange={(e)=>setText(e.target.value)} className="w-full h-full px-[12px] border-none placeholder-black border-b-[1px] outline-none focus:border-none focus:ring-stone-200 w-full h-full font-black text-[14px] leading-[20px] tracking-[0.005em] text-black"/>
                <AudioRecorder audioBlob={audioBlob} setAudioBlob={setAudioBlob}/>
            </div>
            <div className='flex justify-between p-3 px-5'>
              <div className='flex gap-3'>
                {/* <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 0.875C7.39303 0.875 5.82214 1.35152 4.486 2.24431C3.14985 3.1371 2.10844 4.40605 1.49348 5.8907C0.87852 7.37535 0.717618 9.00901 1.03112 10.5851C1.34463 12.1612 2.11846 13.6089 3.25476 14.7452C4.39106 15.8815 5.8388 16.6554 7.4149 16.9689C8.99099 17.2824 10.6247 17.1215 12.1093 16.5065C13.594 15.8916 14.8629 14.8502 15.7557 13.514C16.6485 12.1779 17.125 10.607 17.125 9C17.1227 6.84581 16.266 4.78051 14.7427 3.25727C13.2195 1.73403 11.1542 0.877275 9 0.875ZM9 15.875C7.64026 15.875 6.31105 15.4718 5.18046 14.7164C4.04987 13.9609 3.16868 12.8872 2.64833 11.6309C2.12798 10.3747 1.99183 8.99237 2.2571 7.65875C2.52238 6.32513 3.17716 5.10013 4.13864 4.13864C5.10013 3.17716 6.32514 2.52237 7.65876 2.2571C8.99238 1.99183 10.3747 2.12798 11.631 2.64833C12.8872 3.16868 13.9609 4.04987 14.7164 5.18045C15.4718 6.31104 15.875 7.64025 15.875 9C15.8729 10.8227 15.1479 12.5702 13.8591 13.8591C12.5702 15.1479 10.8227 15.8729 9 15.875ZM5.25 7.4375C5.25 7.25208 5.30499 7.07082 5.408 6.91665C5.51101 6.76248 5.65743 6.64232 5.82874 6.57136C6.00004 6.50041 6.18854 6.48184 6.3704 6.51801C6.55226 6.55419 6.7193 6.64348 6.85042 6.77459C6.98153 6.9057 7.07082 7.07275 7.10699 7.2546C7.14316 7.43646 7.1246 7.62496 7.05364 7.79627C6.98268 7.96757 6.86252 8.11399 6.70835 8.217C6.55418 8.32002 6.37292 8.375 6.1875 8.375C5.93886 8.375 5.70041 8.27623 5.52459 8.10041C5.34878 7.9246 5.25 7.68614 5.25 7.4375ZM12.75 7.4375C12.75 7.62292 12.695 7.80418 12.592 7.95835C12.489 8.11252 12.3426 8.23268 12.1713 8.30364C12 8.37459 11.8115 8.39316 11.6296 8.35699C11.4477 8.32081 11.2807 8.23152 11.1496 8.10041C11.0185 7.9693 10.9292 7.80225 10.893 7.6204C10.8568 7.43854 10.8754 7.25004 10.9464 7.07873C11.0173 6.90743 11.1375 6.76101 11.2917 6.658C11.4458 6.55498 11.6271 6.5 11.8125 6.5C12.0611 6.5 12.2996 6.59877 12.4754 6.77459C12.6512 6.9504 12.75 7.18886 12.75 7.4375ZM12.6664 11.1875C11.8625 12.5773 10.5258 13.375 9 13.375C7.47422 13.375 6.13829 12.5781 5.33438 11.1875C5.28916 11.1164 5.25879 11.0368 5.24511 10.9536C5.23143 10.8705 5.23472 10.7854 5.25477 10.7035C5.27483 10.6216 5.31123 10.5447 5.36181 10.4772C5.41238 10.4098 5.47607 10.3533 5.54905 10.3111C5.62203 10.2689 5.70278 10.2419 5.78646 10.2318C5.87014 10.2216 5.95501 10.2285 6.03596 10.252C6.11692 10.2754 6.19229 10.3151 6.25753 10.3684C6.32278 10.4218 6.37656 10.4878 6.41563 10.5625C6.99922 11.5711 7.91641 12.125 9 12.125C10.0836 12.125 11.0008 11.5703 11.5836 10.5625C11.6665 10.4189 11.803 10.3141 11.9631 10.2712C12.1233 10.2283 12.2939 10.2507 12.4375 10.3336C12.5811 10.4165 12.6859 10.553 12.7288 10.7131C12.7717 10.8733 12.7493 11.0439 12.6664 11.1875Z" fill="#BC6C25"/>
                </svg> */}
                <div><FileUploader onFileUpload={handleFileUpload} setSelectedFile={setSelectedFile} setFileType={setFileType}/></div>
                
              </div>
              <button type='submit'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.1249 9.99123C18.1255 10.2139 18.0665 10.4328 17.9542 10.6251C17.8418 10.8173 17.6801 10.9761 17.4858 11.085L4.36787 18.5858C4.17939 18.6926 3.96656 18.7491 3.7499 18.7498C3.55009 18.7494 3.35329 18.7011 3.176 18.609C2.9987 18.5168 2.84608 18.3835 2.73093 18.2203C2.61577 18.057 2.54143 17.8685 2.51415 17.6705C2.48687 17.4726 2.50743 17.271 2.57412 17.0826L4.71083 10.8365C4.73189 10.7747 4.77177 10.7211 4.82487 10.6831C4.87798 10.6452 4.94164 10.6248 5.00693 10.6248H10.6249C10.7106 10.625 10.7954 10.6076 10.874 10.5736C10.9527 10.5397 11.0235 10.4899 11.0821 10.4274C11.1408 10.3649 11.1859 10.291 11.2148 10.2103C11.2436 10.1297 11.2556 10.0439 11.2499 9.95842C11.2357 9.7977 11.1614 9.64828 11.0417 9.54006C10.922 9.43184 10.7659 9.37282 10.6046 9.37483H5.0124C4.94721 9.37494 4.88361 9.35467 4.83052 9.31684C4.77743 9.27902 4.73749 9.22554 4.7163 9.16389L2.57255 2.91389C2.48907 2.6744 2.48041 2.41518 2.54774 2.17065C2.61506 1.92612 2.75517 1.70786 2.94947 1.54484C3.14376 1.38183 3.38305 1.28177 3.63556 1.25796C3.88806 1.23415 4.14183 1.28772 4.36318 1.41154L17.4882 8.90295C17.6812 9.01165 17.8419 9.1697 17.9538 9.36093C18.0657 9.55216 18.1247 9.76968 18.1249 9.99123Z" fill="#283618"/>
              </svg></button>
              

            </div>
            
            
        </form>
      </div>
    </div>
  );
}

export default ViewMessage;
