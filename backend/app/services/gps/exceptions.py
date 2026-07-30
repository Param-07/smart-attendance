from app.core.exceptions import ConflictException

class GPSAccuracyException(ConflictException):

    def __init__(self):
        super().__init__("School GPS location is not configured. Contact the admin")

class GPSConfigurationException(ConflictException):

    def __init__(self):
        super().__init__("GPS accuracy is too low. Please move to an open area and try again.")

class GPSOutsideAllowedRadiusException(ConflictException):

    def __init__(self):
        super().__init__("You are outside the allowed school premises.")