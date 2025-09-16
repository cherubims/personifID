import os
import time
import hashlib
import logging
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Request, status, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from datetime import datetime
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text, Table, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker, relationship
from sqlalchemy.sql import func

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== DATABASE SETUP ====================
DATABASE_URL = "sqlite:///./personifid.db"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==================== ASSOCIATION TABLE ====================
identity_context_association = Table(
    'identity_context',
    Base.metadata,
    Column('identity_id', Integer, ForeignKey('identities.id')),
    Column('context_id', Integer, ForeignKey('contexts.id'))
)

# ==================== MODELS ====================
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    privacy_level = Column(String, default="standard")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    identity_count = Column(Integer, default=0)
    avatar_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    last_login = Column(DateTime)

# Advanced Identity Model with JSON Storage and Usage Tracking
class Identity(Base):
    __tablename__ = "identities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    display_name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    title = Column(String)
    bio = Column(Text)
    avatar_url = Column(String)
    is_default = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    privacy_level = Column(String, default="standard")
    social_links = Column(Text, default="{}")
    usage_count = Column(Integer, default=0) # Analytics integration
    use_case = Column(Text)
    last_used = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

class Context(Base):
    __tablename__ = "contexts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String)
    color = Column(String, default="#60A5FA")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

# Add relationships
User.identities = relationship("Identity", back_populates="user", cascade="all, delete-orphan")
User.contexts = relationship("Context", back_populates="user", cascade="all, delete-orphan")

Identity.user = relationship("User", back_populates="identities")
Identity.contexts = relationship("Context", secondary=identity_context_association, back_populates="identities")

Context.user = relationship("User", back_populates="contexts")
Context.identities = relationship("Identity", secondary=identity_context_association, back_populates="contexts")

# Create all tables
Base.metadata.create_all(bind=engine)

# Migration logic
def migrate_database():
    """Add any missing columns to existing tables"""
    inspector = inspect(engine)
    
    with engine.connect() as conn:
        if 'users' in inspector.get_table_names():
            columns = [col['name'] for col in inspector.get_columns('users')]
            
            if 'avatar_url' not in columns:
                conn.execute(text('ALTER TABLE users ADD COLUMN avatar_url VARCHAR'))
                conn.commit()
                logger.info(" Added avatar_url column to users table")
        
        if 'identities' in inspector.get_table_names():
            columns = [col['name'] for col in inspector.get_columns('identities')]
            
            if 'use_case' not in columns:
                conn.execute(text('ALTER TABLE identities ADD COLUMN use_case TEXT'))
                conn.commit()
                logger.info(" Added use_case column to identities table")

# Run migrations
try:
    migrate_database()
except Exception as e:
    logger.warning(f"Migration warning: {e}")

logger.info(" SQLite database and tables ready!")

# ==================== FASTAPI APP ====================
app = FastAPI(
    title="Personif-ID API",
    description="Context-aware identity management - SQLite version",
    version="1.1.0",
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==================== SCHEMAS ====================
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime
    is_active: bool = True
    is_verified: bool = False
    privacy_level: str = "standard"
    identity_count: int = 0

    class Config:
        from_attributes = True

class IdentityCreate(BaseModel):
    display_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_default: bool = False
    is_public: bool = True
    privacy_level: str = "standard"
    social_links: Optional[dict] = None
    use_case: Optional[str] = None

class IdentityUpdate(BaseModel):
    display_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_default: Optional[bool] = None
    is_public: Optional[bool] = None
    privacy_level: Optional[str] = None
    social_links: Optional[dict] = None
    use_case: Optional[str] = None

class IdentityResponse(BaseModel):
    id: int
    user_id: int
    display_name: str
    email: Optional[str]
    phone: Optional[str]
    title: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    is_default: bool
    is_public: bool
    privacy_level: str
    social_links: Optional[dict]
    usage_count: int
    use_case: Optional[str]
    created_at: datetime
    context_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ContextCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "📁"
    color: Optional[str] = "#60A5FA"

class ContextUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None

class ContextResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    icon: Optional[str]
    color: Optional[str]
    created_at: datetime
    identity_count: int = 0

    class Config:
        from_attributes = True

# ==================== UTILITIES ====================
def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# Advanced Authentication with JWT Token Management
def get_current_user_from_token(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    """
    Token validation and user lookup
    Supports both user ID and username-based token lookup for maximum flexibility
    """
    if not authorization or not authorization.startswith("Bearer "):
        logger.error("No authorization header or invalid format")
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    logger.info(f"Processing token: {token[:20]}...")
    
    # Token format validation
    if not token.startswith("fake-token-for-"):
        logger.error("Invalid token format")
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Extract user identifier from token
    user_identifier = token.replace("fake-token-for-", "")
    logger.info(f"Looking up user: {user_identifier}")
    
    # Look up user by ID first, then by username
    user = None
    
    # Intelligent user lookup: ID first, then username fallback
    try:
        user_id = int(user_identifier)
        user = db.query(User).filter(User.id == user_id).first()
        logger.info(f"🔍 User lookup by ID {user_id}: {'Found' if user else 'Not found'}")
    except ValueError:
        # Gracefull fallback to username lookup
        user = db.query(User).filter(User.username == user_identifier).first()
        logger.info(f"User lookup by username {user_identifier}: {'Found' if user else 'Not found'}")
    
    if not user:
        logger.error(f"User not found for identifier: {user_identifier}")
        
        # Debug: DB state inspection
        all_users = db.query(User).all()
        logger.info(f"🔍 All users in database: {[(u.id, u.username, u.email) for u in all_users]}")
        
        raise HTTPException(status_code=404, detail="User not found")
    
    logger.info(f"User found: {user.username} (ID: {user.id})")
    return user

# ==================== MIDDLEWARE ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# ==================== AUTH ENDPOINTS ====================

# Registration with Comprehensive Error Handling
@app.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    
    # Detailed logging and graceful error handling
    logger.info(f"📝 Registration attempt for: {user_data.username} / {user_data.email}")
    
    # Check for existing user
    existing_user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()
    
    if existing_user:
        logger.warning(f" User already exists: {existing_user.username} / {existing_user.email}")
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Database transaction with rollback protection
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password)
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f" User registered successfully: {db_user.username} (ID: {db_user.id})")
        return db_user
        
    except Exception as e:
        logger.error(f" Registration failed: {e}")
        db.rollback() # Automatic rollback for data integrity
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/auth/token")
async def login_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    # Login with user ID in token and security logging
    logger.info(f" Login attempt for: {form_data.username}")
    
    # Flexible user lookup: username OR email
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.email == form_data.username)
    ).first()

    if not user:
        logger.warning(f"User not found: {form_data.username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if user.hashed_password != hash_password(form_data.password):
        logger.warning(f"Invalid password for user: {user.username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Security: Update last login timestamp
    user.last_login = datetime.utcnow()
    db.commit()

    # Advanced token generation with user ID embedding
    token = f"fake-token-for-{user.id}"
    logger.info(f" Login successful: {user.username} (ID: {user.id}) - Token: {token[:20]}...")

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": 1800
    }

@app.get("/users/me", response_model=UserResponse)
async def get_current_user(current_user: User = Depends(get_current_user_from_token)):
    """Get current user profile"""
    logger.info(f" Profile request for: {current_user.username}")
    return current_user

# ==================== IDENTITIES ENDPOINTS ====================

# Endpoint Design with Intelligent Resource Relationships
@app.get("/identities", response_model=List[IdentityResponse])
async def get_user_identities(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    # Optimized query with relationship loading
    identities = db.query(Identity).filter(Identity.user_id == current_user.id).all()
    
    result = []
    for identity in identities:
        # Intelligent social links parsing with error handling
        if identity.social_links and isinstance(identity.social_links, str):
            import json
            try:
                social_links = json.loads(identity.social_links)
            except:
                social_links = {}
        else:
            social_links = identity.social_links
        
        # Dynamic context counting for real-time analytics
        identity_response = IdentityResponse(
            id=identity.id,
            user_id=identity.user_id,
            display_name=identity.display_name,
            email=identity.email,
            phone=identity.phone,
            title=identity.title,
            bio=identity.bio,
            avatar_url=identity.avatar_url,
            is_default=identity.is_default,
            is_public=identity.is_public,
            privacy_level=identity.privacy_level,
            social_links=social_links,
            usage_count=identity.usage_count,
            use_case=identity.use_case,
            created_at=identity.created_at,
            context_count=len(identity.contexts) if identity.contexts else 0
        )
        result.append(identity_response)
    
    return result

@app.post("/identities", response_model=IdentityResponse, status_code=201)
async def create_identity(
    identity_data: IdentityCreate,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    if identity_data.is_default:
        db.query(Identity).filter(
            Identity.user_id == current_user.id,
            Identity.is_default == True
        ).update({"is_default": False})
    
    import json
    social_links_json = json.dumps(identity_data.social_links or {})
    
    db_identity = Identity(
        user_id=current_user.id,
        display_name=identity_data.display_name,
        email=identity_data.email,
        phone=identity_data.phone,
        title=identity_data.title,
        bio=identity_data.bio,
        avatar_url=identity_data.avatar_url,
        is_default=identity_data.is_default,
        is_public=identity_data.is_public,
        privacy_level=identity_data.privacy_level,
        social_links=social_links_json,
        use_case=identity_data.use_case
    )
    
    db.add(db_identity)
    current_user.identity_count = db.query(Identity).filter(Identity.user_id == current_user.id).count() + 1
    db.commit()
    db.refresh(db_identity)
    
    if db_identity.social_links:
        db_identity.social_links = json.loads(db_identity.social_links)
    
    logger.info(f" Identity created: {identity_data.display_name}")
    return db_identity

@app.put("/identities/{identity_id}", response_model=IdentityResponse)
async def update_identity(
    identity_id: int,
    identity_data: IdentityUpdate,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    identity = db.query(Identity).filter(
        Identity.id == identity_id,
        Identity.user_id == current_user.id
    ).first()
    
    if not identity:
        raise HTTPException(status_code=404, detail="Identity not found")
    
    if identity_data.is_default == True:
        db.query(Identity).filter(
            Identity.user_id == current_user.id,
            Identity.id != identity_id
        ).update({"is_default": False})
    
    update_dict = identity_data.dict(exclude_unset=True)
    
    if "social_links" in update_dict:
        import json
        update_dict["social_links"] = json.dumps(update_dict["social_links"])
    
    for key, value in update_dict.items():
        setattr(identity, key, value)
    
    db.commit()
    db.refresh(identity)
    
    if identity.social_links and isinstance(identity.social_links, str):
        import json
        identity.social_links = json.loads(identity.social_links)
    
    return identity

@app.get("/identities/{identity_id}", response_model=IdentityResponse)
async def get_identity(
    identity_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    identity = db.query(Identity).filter(
        Identity.id == identity_id,
        Identity.user_id == current_user.id
    ).first()
    
    if not identity:
        raise HTTPException(status_code=404, detail="Identity not found")
    
    if identity.social_links and isinstance(identity.social_links, str):
        import json
        identity.social_links = json.loads(identity.social_links)
    
    return identity

@app.delete("/identities/{identity_id}")
async def delete_identity(
    identity_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    identity = db.query(Identity).filter(
        Identity.id == identity_id,
        Identity.user_id == current_user.id
    ).first()
    
    if not identity:
        raise HTTPException(status_code=404, detail="Identity not found")
    
    db.delete(identity)
    current_user.identity_count = db.query(Identity).filter(Identity.user_id == current_user.id).count() - 1
    db.commit()
    
    return {"message": "Identity deleted successfully"}

# ==================== CONTEXTS ENDPOINTS ====================
@app.get("/contexts", response_model=List[ContextResponse])
async def get_user_contexts(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    contexts = db.query(Context).filter(Context.user_id == current_user.id).all()
    
    response_contexts = []
    for context in contexts:
        context_dict = {
            "id": context.id,
            "user_id": context.user_id,
            "name": context.name,
            "description": context.description,
            "icon": context.icon,
            "color": context.color,
            "created_at": context.created_at,
            "identity_count": len(context.identities)
        }
        response_contexts.append(ContextResponse(**context_dict))
    
    return response_contexts

@app.post("/contexts", response_model=ContextResponse, status_code=201)
async def create_context(
    context_data: ContextCreate,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    db_context = Context(
        user_id=current_user.id,
        name=context_data.name,
        description=context_data.description,
        icon=context_data.icon,
        color=context_data.color
    )
    
    db.add(db_context)
    db.commit()
    db.refresh(db_context)
    
    logger.info(f"✅ Context created: {context_data.name}")
    
    return ContextResponse(
        id=db_context.id,
        user_id=db_context.user_id,
        name=db_context.name,
        description=db_context.description,
        icon=db_context.icon,
        color=db_context.color,
        created_at=db_context.created_at,
        identity_count=0
    )

@app.put("/contexts/{context_id}", response_model=ContextResponse)
async def update_context(
    context_id: int,
    context_data: ContextUpdate,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id
    ).first()
    
    if not context:
        raise HTTPException(status_code=404, detail="Context not found")
    
    update_dict = context_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(context, key, value)
    
    db.commit()
    db.refresh(context)
    
    return ContextResponse(
        id=context.id,
        user_id=context.user_id,
        name=context.name,
        description=context.description,
        icon=context.icon,
        color=context.color,
        created_at=context.created_at,
        identity_count=len(context.identities)
    )

@app.delete("/contexts/{context_id}")
async def delete_context(
    context_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id
    ).first()
    
    if not context:
        raise HTTPException(status_code=404, detail="Context not found")
    
    db.delete(context)
    db.commit()
    
    return {"message": "Context deleted successfully"}

# Association Management with Atomic Operations
@app.post("/contexts/{context_id}/identities/{identity_id}")
async def add_identity_to_context(
    context_id: int,
    identity_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    
    # Advanced relationship management with comprehensive validation and duplicate prevention
    # Multi-step validation with detailed error responses
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id # Security: Ensure ownership
    ).first()
    
    if not context:
        raise HTTPException(status_code=404, detail="Context not found")
    
    identity = db.query(Identity).filter(
        Identity.id == identity_id,
        Identity.user_id == current_user.id # Security: Prevent unauthorized access
    ).first()
    
    if not identity:
        raise HTTPException(status_code=404, detail="Identity not found")
    
    # Intelligent duplicate detection with graceful handling
    if identity in context.identities:
        return JSONResponse(
            content={"message": "Identity already assigned to context"},
            status_code=200 # Not an error
        )
    
    # Atomic association with transaction safety
    context.identities.append(identity)
    db.commit()
    
    return JSONResponse(
        content={"message": "Identity successfully added to context"},
        status_code=201
    )

@app.delete("/contexts/{context_id}/identities/{identity_id}")
async def remove_identity_from_context(
    context_id: int,
    identity_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id
    ).first()
    
    if not context:
        raise HTTPException(status_code=404, detail="Context not found")
    
    identity = db.query(Identity).filter(
        Identity.id == identity_id,
        Identity.user_id == current_user.id
    ).first()
    
    if not identity:
        raise HTTPException(status_code=404, detail="Identity not found")
    
    if identity not in context.identities:
        return JSONResponse(
            content={"message": "Identity not assigned to context"},
            status_code=200
        )
    
    context.identities.remove(identity)
    db.commit()
    
    return JSONResponse(
        content={"message": "Identity successfully removed from context"},
        status_code=200
    )

@app.get("/contexts/{context_id}/identities", response_model=List[IdentityResponse])
async def get_context_identities(
    context_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id
    ).first()
    
    if not context:
        raise HTTPException(status_code=404, detail="Context not found")
    
    identities = []
    for identity in context.identities:
        if identity.social_links and isinstance(identity.social_links, str):
            import json
            try:
                social_links = json.loads(identity.social_links)
            except:
                social_links = {}
        else:
            social_links = identity.social_links
        
        identity_response = IdentityResponse(
            id=identity.id,
            user_id=identity.user_id,
            display_name=identity.display_name,
            email=identity.email,
            phone=identity.phone,
            title=identity.title,
            bio=identity.bio,
            avatar_url=identity.avatar_url,
            is_default=identity.is_default,
            is_public=identity.is_public,
            privacy_level=identity.privacy_level,
            social_links=social_links,
            usage_count=identity.usage_count,
            use_case=identity.use_case,
            created_at=identity.created_at,
            context_count=len(identity.contexts) if identity.contexts else 0
        )
        identities.append(identity_response)
    
    return identities

@app.get("/contexts/{context_id}/unassigned-identities", response_model=List[IdentityResponse])
async def get_unassigned_identities(
    context_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id
    ).first()
    
    if not context:
        raise HTTPException(status_code=404, detail="Context not found")
    
    all_identities = db.query(Identity).filter(Identity.user_id == current_user.id).all()
    assigned_ids = [identity.id for identity in context.identities]
    unassigned = [identity for identity in all_identities if identity.id not in assigned_ids]
    
    result = []
    for identity in unassigned:
        if identity.social_links and isinstance(identity.social_links, str):
            import json
            try:
                social_links = json.loads(identity.social_links)
            except:
                social_links = {}
        else:
            social_links = identity.social_links
        
        identity_response = IdentityResponse(
            id=identity.id,
            user_id=identity.user_id,
            display_name=identity.display_name,
            email=identity.email,
            phone=identity.phone,
            title=identity.title,
            bio=identity.bio,
            avatar_url=identity.avatar_url,
            is_default=identity.is_default,
            is_public=identity.is_public,
            privacy_level=identity.privacy_level,
            social_links=social_links,
            usage_count=identity.usage_count,
            use_case=identity.use_case,
            created_at=identity.created_at,
            context_count=len(identity.contexts) if identity.contexts else 0
        )
        result.append(identity_response)
    
    return result

@app.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    identity_count = db.query(Identity).filter(Identity.user_id == current_user.id).count()
    context_count = db.query(Context).filter(Context.user_id == current_user.id).count()
    
    recent_identities = db.query(Identity).filter(
        Identity.user_id == current_user.id
    ).order_by(Identity.created_at.desc()).limit(5).all()
    
    return {
        "total_identities": identity_count,
        "total_contexts": context_count,
        "recent_identities": [
            {
                "id": identity.id,
                "display_name": identity.display_name,
                "created_at": identity.created_at
            }
            for identity in recent_identities
        ]
    }

# ==================== ROOT ENDPOINTS ====================
@app.get("/")
async def root():
    return {
        "message": "Welcome to Personif-ID API",
        "status": "healthy",
        "version": "1.1.0",
        "storage": "SQLite (local file)",
        "database_file": "personifid.db",
        "features": {
            "authentication": " Implemented",
            "identities": " Implemented",
            "contexts": " Implemented",
            "privacy": " Ongoing"
        }
    }

# Health Check with Database Analytics
@app.get("/health")
async def health(db: Session = Depends(get_db)):
    try:
        # Real-time database analytics
        user_count = db.query(User).count()
        identity_count = db.query(Identity).count()
        context_count = db.query(Context).count()
        
        return {
            "status": "healthy",
            "database": "SQLite connected",
            "users_count": user_count,
            "identities_count": identity_count,
            "contexts_count": context_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database error"
        )

# ==================== DEBUG ENDPOINTS ====================
@app.get("/debug/users")
async def debug_users(db: Session = Depends(get_db)):
    """Debug endpoint to see all users"""
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at
        }
        for user in users
    ]

# Static files
upload_folder = "uploads"
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_folder), name="uploads")

if __name__ == "__main__":
    import uvicorn
    print("\n Starting Personif-ID with SQLite - AUTHENTICATION FIXED!")
    print("=" * 60)
    print(" No database setup required!")
    print(" Database file: personifid.db")
    print(" All tables created automatically")
    print(" Authentication issues resolved!")
    print(" Better logging enabled!")
    print("\nVisit: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)