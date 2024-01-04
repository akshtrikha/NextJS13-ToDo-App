import TodoItem from "@/components/TodoItem";
import { prisma } from "@/db";
import Link from "next/link";
import {redirect} from "next/navigation"

async function putTodos(name: string) {
    await prisma.todo.create({ data: { title: name, complete: true } });
}

async function deleteAllTodos(name: string) {
    await prisma.todo.deleteMany({ where: { title: { contains: name } } });
}

async function deleteTodo(id: string) {
    //? Need to use a unique property like id here as the key in where object in delete function
    await prisma.todo.delete({ where: { id: id } });
}

async function toggleTodo(id: string, complete: boolean) {
    "use server";

    const updatedTodo = await prisma.todo.update({
        where: {
            id: id,
        },
        data: {
            complete: complete,
        },
    });

    redirect("/new");
    console.log(updatedTodo)
}

export default async function Home() {
    const todos = await prisma.todo.findMany();
    // putTodos("todo 7");
    // deleteAllTodos("a");
    // deleteAllTodos("notok");
    // deleteAllTodos("okokok");
    // deleteTodo("");
    console.log("hey");
    console.log("todos", todos);

    return (
        <>
            <header className="flex justify-between items-center mx-4">
                <h1 className="text-2xl">Todos</h1>
                <Link
                    className="border border-slate-300 text-slate-300 px-2 py1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
                    href="/new"
                >
                    New
                </Link>
            </header>
            <ul className="pl-4">
                {todos.map((todo) => {
                    return (
                        <TodoItem
                            key={todo.id}
                            {...todo}
                            toggleTodo={toggleTodo}
                        />
                    );
                })}
            </ul>
        </>
    );
}
