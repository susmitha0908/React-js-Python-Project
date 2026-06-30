from pydantic import BaseModel

class CommandBase(BaseModel):
    command: str
    category: str
    description: str
    use_case: str
    example_output: str
    difficulty: str  # Beginner, Intermediate, Advanced

class CommandCreate(CommandBase):
    pass

class Command(CommandBase):
    id: int
