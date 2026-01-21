import React from 'react'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'; // Icons ke liye
function FAQbar({question, answer}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
    onClick={()=>setIsOpen(!isOpen)}
    className=' bg-white rounded-sm p-3 flex flex-col transition-all my-5 text-primary
    lg:rounded-xl
    ' 
    >
        <div className='w-full flex justify-between items-center'>
                    <h1 className=''>{question}</h1>
        <div>
            {isOpen? <X size={24}/>:<Plus size={24}/>}
        </div>
        </div>
        <div className={` overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? ' max-h-auto opacity-100' : ' max-h-0 opacity-0' }
            `}>
            <div className='pt-3 text-primary text-sm font-normal leading-relaxed'>
{answer}
            </div>
        </div>

    </div>
  )
}

export default FAQbar
