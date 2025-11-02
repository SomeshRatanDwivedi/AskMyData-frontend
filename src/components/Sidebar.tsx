
import React, { useEffect, useRef, useState } from 'react';
import { PlusIcon } from './Icons';
import { Button } from './ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'react-toastify';
import { handleCatchBlockError } from '@/utility';
import { getUserFiles, uploadFile } from '@/api/file';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{id:string, originalName:string}[]>([]);
  const [fileUploading, setFileUploading] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    return navigate("/app");
  }

  const handleInputClick = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  }
  const handleInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    // access the selected files via event.target.files
    try {
      const selected = event.target.files?.[0] ?? null;
      if (!selected) return toast.error("Please select atleast 1 file.");
      setFileUploading(true);
      const formData = new FormData();
      formData.append('file', selected);
      const res = await uploadFile(formData);
      if (res?.success) {
        setFiles((prev)=>[...prev, res?.data])
        toast.success("File uploaded successfully.")
      } else {
        toast.error(res?.message);
      }
      setFileUploading(false);
    } catch (err) {
      handleCatchBlockError(err, "File upload fail.");
      setFileUploading(false);
    } finally {
      event.target.value = "";
    }
  }

  const getFiles = async () => {
    try {
      const res = await getUserFiles();
      if (res?.success) {
        setFiles(res.data);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      handleCatchBlockError(err, "Error in getting files.")
    }
  }

  useEffect(() => {
    getFiles();
  }, [])
  

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 bg-white px-4 py-2 cursor-pointer" onClick={handleLogoClick}>AskMyData</h1>
      <div className="p-4 flex-1 flex flex-col space-y-2 bg-white h-[calc(100%-48px)]">
        <input type='file' id='file' name='file' ref={inputRef} className='hidden' onChange={handleInputChange} />
        {
          !fileUploading ? (
            <Button onClick={handleInputClick} variant="outline" className='cursor-pointer bg-indigo-500 text-white'>
              <PlusIcon />
              Upload File
            </Button>
          ) :
            (
              <Button variant="outline" className='cursor-pointer bg-indigo-500 text-white' disabled>
                <Spinner />
                  File Uploading
              </Button>
            )
        }
        <ul className='h-full overflow-y-auto'>
          {
            files?.map(ele => (
              <li key={ele.id} className='cursor-pointer py-1 px-0.5 rounded-sm hover:bg-gray-100 overflow-hidden text-ellipsis line-clamp-1'>
                {ele.originalName}
              </li>
            ))
          }
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
