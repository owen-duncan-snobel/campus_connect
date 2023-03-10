import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/router'
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

const Display = () => {
    const router = useRouter()
    const user = useUser()
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
    const files = acceptedFiles.map(file => (
        <li key={file.name}>
            {file.name}
        </li>
    ))


  const submitFiles = async (event: any) => {
      event.preventDefault()

      const formData = new FormData()
      acceptedFiles.forEach(file => formData.append('files', file))
      formData.append('class_name', '1012')
      formData.append('class_year', '2022')

      const response = await fetch(`${SERVER_URL}/files/upload`, {
          method: 'POST',
          // headers: {
          //   'Content-Type': 'multipart/form-data'
          // },
          body: formData
      })
      const data = await response.json()

      router.reload()
  }
    
  return (
    <>
        <div className="p-12 text-center bg-white-100 text-white-700">
          {!user && (
            <div>
              <h2 className="font-semibold text-4xl mb-4">Login To Upload Your Notes</h2>
            </div>
          )}

          {user && (
              <>
                <h2 className="font-semibold text-4xl mb-4">Upload Your Notes</h2>
                <h4 className="font-semibold text-xl mb-6">Helping Students to Survive Since 2004</h4>
                <div className='flex justify-center'>
                  <div className='w-1/2'>
                    <section className="container">
                        <div {...getRootProps({ className: 'dropzone' })} className='bg-blue-500 text-white rounded-lg font-medium py-2 px-3'>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                        <aside>
                            <h4>Files</h4>
                            <ul>{files}</ul>
                        </aside>
                        <button onClick={submitFiles} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">SUBMIT FILES</button>
                    </section>
                  </div>
                </div>
              </>
            )}

            <Items />
            {/* <form onSubmit={submitFiles}>
          <div className="flex items-center justify-center w-full px-80">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2  border-dashed rounded-lg cursor-pointer bg-sky-50 dark:hover:bg-sky-800 dark:bg-sky-700 hover:bg-sky-100 dark:border-white-600 dark:hover:border-white-500 dark:hover:bg-white-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-white-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-white-500 text-white-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-white-500 text-white-400">SVG, PNG, JPG or GIF</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setFiles(event.target.files)} 
                  multiple={true} 
                  className="hidden" 
                />
            </label>
          </div>

          <button type="submit">
            Submit Files
          </button>
        </form> */}
        </div>
        <div></div>
    </>
  )
}


export const Items = () => {

  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/files`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setFiles(data.data)
      } catch (err){
        console.log(err)
      }
    }
    getFiles()
  },[])
   
  return (
    <section className="container">
      <div className="p-12 grid gap-4 text-white-700">
          <div className="grid grid-cols-2 gap-4 ">
            {
              files.map(file => {
                const properties = file.Key.split('/') 
                const class_name = properties[0]
                const class_year = properties[1]
                const filename = properties[2]
                return (
                  <div className='border-solid border-2 subpixel-antialiased'>
                      <h2 className="text-lg font-medium">File: <span className='text-sm font-normal'>{filename}</span></h2>
                      <h2 className="text-md font-medium">Class Name: <span className='text-sm font-normal'>{class_name}</span></h2>
                      <h2 className="text-md font-medium">Class Year: <span className='text-sm font-normal'>{class_year}</span></h2>
                      <div className='flex justify-center'>
                        <embed src={`https://campusconnect.nyc3.digitaloceanspaces.com/${file.Key}`} type="application/pdf" width="400px" height="400px" />
                      </div>
                      <div className='my-5'>
                        <a href={`https://campusconnect.nyc3.digitaloceanspaces.com/${file.Key}`} className='bg-blue-500 px-3 py-1 text-white font-medium rounded-lg hover:bg-blue-700 my-2'>
                          DOWNLOAD FILES
                        </a>
                      </div>
                  </div>
                )
            })
            }
          </div>
        </div>
    </section>)
}
export default Display