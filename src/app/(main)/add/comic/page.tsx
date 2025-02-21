import AddComicForm from '@/app/(main)/add/comic/AddComicForm'
import React from 'react'

export default function AddComicPage() {
    return (
        <div className="flex items-center flex-col py-20 gap-10 justify-center">
            <h1 className="text-4xl font-bold ">Add Comic</h1>
            <AddComicForm />
        </div>
    )
}
