import React from 'react';
import { contacts } from '../../data/contacts';
import Image from 'next/image';
export default function Contacts() {
  return (
    <div className="my-10">
      <h2 className="font-semibold text-xl">Contacts</h2>
      <p className="text-slate-500">
        I&apos;m always open to new opportunities, feel free to contact me!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-10  mt-5">
        {contacts.map((contact) => (
          <div
            style={{
              background: `${contact.background}`,
            }}
            key={contact.name}
            className={`flex items-start jus mt-2 border-2 rounded-lg px-4 py-5`}
          >
            <Image src={contact.image} alt={contact.name} className={`w-8 h-8 mr-4 self-start `} />
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm mb-2">{contact.description}</p>
              <a
                href={contact.url}
                target="_blank"
                style={{
                  background: `${contact.color}`,
                }}
                className={
                  'block w-max text-white px-3 py-1 rounded-xl text-xs hover:opacity-90 transition-all transform duration-300 hover:-translate-y-1 '
                }
              >
                {contact.button}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
