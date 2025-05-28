import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { carList } from "./data/data";

export default function RideSelector({ pickup, dropoff }) {
    const [rideDuration, setRideDuration] = useState(0);
    const [rideDistance, setRideDistance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pickup || !dropoff || pickup.length !== 2 || dropoff.length !== 2) {
            setError("Invalid pickup or dropoff coordinates");
            setLoading(false);
            return;
        }

        const fetchRouteInfo = async () => {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
                );
                const data = await response.json();

                if (data.routes && data.routes[0]) {
                    // Duration is in seconds, convert to minutes
                    setRideDuration(data.routes[0].duration / 60);
                    // Distance is in meters, convert to kilometers
                    setRideDistance(data.routes[0].distance / 1000);
                } else {
                    setError("Could not calculate route");
                }
            } catch (err) {
                setError("Error calculating route");
                console.error("Error fetching route:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRouteInfo();
    }, [pickup, dropoff]);

    const calculatePrice = (multiplier) => {
        // Base price calculation:
        // - Base fare: $2.50
        // - Per km: $1.50
        // - Per minute: $0.20
        const baseFare = 2.50;
        const perKmRate = 1.50;
        const perMinuteRate = 0.20;

        const price = (baseFare + (rideDistance * perKmRate) + (rideDuration * perMinuteRate)) * multiplier;
        return price.toFixed(2);
    };

    if (loading) {
        return (
            <Wrapper>
                <LoadingMessage>Calculating fares...</LoadingMessage>
            </Wrapper>
        );
    }

    if (error) {
        return (
            <Wrapper>
                <ErrorMessage>{error}</ErrorMessage>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Title>Choose a ride, or swipe up for more</Title>
            <CarList>
                {carList.map((car, index) => (
                    <Car key={index}>
                        <CarImage src={car.imgUrl} alt={car.service} />
                        <CarDetails>
                            <Service>{car.service}</Service>
                            <Time>{Math.round(rideDuration)} min away</Time>
                        </CarDetails>
                        <Price>${calculatePrice(car.multiplier)}</Price>
                    </Car>
                ))}
            </CarList>
        </Wrapper>
    );
}

const Wrapper = tw.div`
    flex-1 overflow-y-scroll flex flex-col
`;

const Title = tw.div`
    text-gray-500 text-center text-xs py-2 border-b
`;

const CarList = tw.div`
    overflow-y-scroll
`;

const Car = tw.div`
    flex p-4 items-center hover:bg-gray-100 cursor-pointer
`;

const CarImage = tw.img`
    h-14 mr-4
`;

const CarDetails = tw.div`
    flex-1
`;

const Service = tw.div`
    font-medium
`;

const Time = tw.div`
    text-xs text-blue-500
`;

const Price = tw.div`
    text-sm font-medium
`;

const LoadingMessage = tw.div`
    text-center py-4 text-gray-500
`;

const ErrorMessage = tw.div`
    text-center py-4 text-red-500
`;