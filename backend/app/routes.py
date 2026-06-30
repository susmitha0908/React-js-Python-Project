from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from .models import Command, CommandCreate
from . import data

router = APIRouter()

@router.get("/commands", response_model=List[Command])
def get_commands(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None)
):
    results = data.commands_db
    if category:
        results = [c for c in results if c.category.lower() == category.lower()]
    if difficulty:
        results = [c for c in results if c.difficulty.lower() == difficulty.lower()]
    if search:
        s = search.lower()
        results = [
            c for c in results 
            if s in c.command.lower() 
            or s in c.description.lower() 
            or s in c.use_case.lower()
        ]
    return results

@router.get("/commands/{id}", response_model=Command)
def get_command(id: int):
    for c in data.commands_db:
        if c.id == id:
            return c
    raise HTTPException(status_code=404, detail="Command not found")

@router.get("/commands/category/{category}", response_model=List[Command])
def get_commands_by_category(category: str):
    results = [c for c in data.commands_db if c.category.lower() == category.lower()]
    return results

@router.post("/commands", response_model=Command, status_code=201)
def create_command(command_in: CommandCreate):
    new_cmd = Command(
        id=data.next_id,
        command=command_in.command,
        category=command_in.category,
        description=command_in.description,
        use_case=command_in.use_case,
        example_output=command_in.example_output,
        difficulty=command_in.difficulty
    )
    data.commands_db.append(new_cmd)
    data.next_id += 1
    return new_cmd

@router.delete("/commands/{id}")
def delete_command(id: int):
    for idx, c in enumerate(data.commands_db):
        if c.id == id:
            data.favorites_db.discard(id)
            deleted = data.commands_db.pop(idx)
            return {"message": "Command deleted successfully", "id": id}
    raise HTTPException(status_code=404, detail="Command not found")

@router.post("/favorites/{id}")
def toggle_favorite(id: int):
    exists = any(c.id == id for c in data.commands_db)
    if not exists:
        raise HTTPException(status_code=404, detail="Command not found")
    
    if id in data.favorites_db:
        data.favorites_db.remove(id)
        is_favorite = False
    else:
        data.favorites_db.add(id)
        is_favorite = True
        
    return {"id": id, "is_favorite": is_favorite}

@router.get("/favorites", response_model=List[Command])
def get_favorites():
    return [c for c in data.commands_db if c.id in data.favorites_db]
