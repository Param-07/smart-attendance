from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    TEACHER = "TEACHER"

class AccountStatus(str, Enum):
    ACTIVE = "ACTIVE"
    LOCKED = "LOCKED"
    DISABLED = "DISABLED"

class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHERS = "Others"
    
class Department(str, Enum):
    ADMINISTRATION = "Administration"
    MATHEMATICS = "Mathematics"
    SCIENCE = "Science"
    ENGLISH = "English"
    SOCIAL_SCIENCE = "Social Science"
    COMPUTER = "Computer"
    SPORTS = "Sports"
    ART = "Art"
    MUSIC = "Music"
    LIBRARY = "Library"

class Designation(str, Enum):
    PRINCIPAL = "Principal"
    VICE_PRINCIPAL = "Vice Principal"
    HOD = "Head of Department"
    TEACHER = "Teacher"
    ASSISTANT_TEACHER = "Assistant Teacher"
    SPORTS_COACH = "Sports Coach"
    LIBRARIAN = "Librarian"
    ADMINISTRATOR = "Administrator"

class EmploymentStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ON_LEAVE = "ON_LEAVE"
    SUSPENDED = "SUSPENDED"
    RESIGNED = "RESIGNED"
    RETIRED = "RETIRED"

class AttendanceType(str, Enum):
    CHECK_IN = "CHECK_IN"
    CHECK_OUT = "CHECK_OUT"

class AttendanceStatus(str, Enum):
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"

class FaceRegistrationStatus(str, Enum):
    NOT_REGISTERED = "NOT_REGISTERED"
    REGISTERED = "REGISTERED"