from __future__ import annotations

from decimal import Decimal
from math import atan2, cos, radians, sin, sqrt

from app.models.school_configuration import SchoolConfiguration
from .exceptions import (
    GPSAccuracyException,
    GPSConfigurationException,
    GPSOutsideAllowedRadiusException
)

class GPSValidationServce:
    """
    Validates teacher GPS location against the configured school location.
    """

    EARTH_RADIUS_METERS = 6_371_000

    def validate(
        self,
        *,
        configurations: SchoolConfiguration,
        latitude: Decimal,
        longitude: Decimal,
        accuracy: int,
        gps_required: bool
    ) -> None:
        """
        Raises an exception if GPS validation fails.
        """

        if not gps_required:
            return

        self._validate_configuration(configurations)
        self._validate_accuracy(
            accuracy,
            threshold= configurations.gps_accuracy_threshold
        )

        distance = self._calculate_distance(
            user_latitude= latitude,
            user_longitude= longitude,
            school_latitude= configurations.school_latitude,
            school_longitude= configurations.school_latitude
        )

        self._validate_radius(
            distance,
            allowed_radius= configurations.allowed_radius
        )

    # Private helpers

    def _validate_configuration(
        self,
        configuration: SchoolConfiguration,
    ) -> None:

        if (
            configuration.school_latitude is None
            or configuration.school_longitude is None
        ):
            raise GPSConfigurationException()

    def _validate_accuracy(
        self,
        *,
        accuracy: int,
        threshold: int,
    ) -> None:

        if accuracy > threshold:
            raise GPSAccuracyException()

    def _validate_radius(
        self,
        *,
        distance: float,
        allowed_radius: int,
    ) -> None:

        if distance > allowed_radius:
            raise GPSOutsideAllowedRadiusException()

    def _calculate_distance(
        self,
        *,
        user_latitude: Decimal,
        user_longitude: Decimal,
        school_latitude: Decimal,
        school_longitude: Decimal,
    ) -> float:

        lat1 = radians(float(user_latitude))
        lon1 = radians(float(user_longitude))

        lat2 = radians(float(school_latitude))
        lon2 = radians(float(school_longitude))

        delta_lat = lat2 - lat1
        delta_lon = lon2 - lon1

        a = (
            sin(delta_lat / 2) ** 2
            + cos(lat1)
            * cos(lat2)
            * sin(delta_lon / 2) ** 2
        )

        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return self.EARTH_RADIUS_METERS * c