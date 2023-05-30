import React from 'react';
import { contacts } from '../../data/contacts';
import Image from 'next/image';
export default function Contacts() {
  return (
    <div className="mt-10">
      <h2 className="font-semibold text-xl">Contacts</h2>
      <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-10 h-44">
        {contacts.map((contact) => (
          <div
            key={contact.name}
            className={`flex items-start jus mt-2 border-2 rounded-md px-4 py-5 bg-[${contact.color}]`}
          >
            <Image src={contact.image} alt={contact.name} className={`w-8 h-8 mr-4 self-start `} />
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm">{contact.description}</p>
              <a href={contact.url} className={'text-sm text-blue-500 hover:underline'}>
                {contact.button}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
