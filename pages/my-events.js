import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { Card, Col, Row, Text } from "@nextui-org/react";
import Layout from "../components/layout";
import AccessDenied from "../components/access-denied";
import styles from "../styles/Home.module.css";
import stylesMyEvents from "../styles/MyEvents.module.css";

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const [content, setContent] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(
    session ? true : false
  );

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/events/my-events");
      const json = await res.json();
      if (json) {
        console.log("json is ", json);
        setIsLoadingContent(false);
        setContent(json.events);
      }
    };
    if (session) fetchData();
  }, [session]);

  const deleteEvent = async (eventId) => {
    const eventsInfo = await axios.post(`/api/events/${eventId}/delete`);
    setIsLoadingContent(true);
    const res = await fetch("/api/events/my-events");
    console.log("session is ", session);
    const json = await res.json();
    if (json) {
      setIsLoadingContent(false);
      setContent(json.events);
    }
    return eventsInfo.data.events;
  };

  if (status === "loading" || isLoadingContent) {
    return (
      <Layout>
        <h1 style={{ textAlign: "center" }}>My Events</h1>
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      </Layout>
    );
  }

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  // If session exists, display content
  return (
    <Layout>
      <h1 style={{ textAlign: "center" }}>My Events</h1>
      <div className={styles.grid}>
        {content.map(
          ({
            images,
            distance,
            url,
            embeddedInfo,
            name,
            dates,
            eventId: id,
          }) => {
            const mobileImageUrl =
              images.find(({ ratio }) => ratio === "4_3")?.url ??
              images.find(({ ratio }) => ratio === "3_2")?.url;
            const eventDate = dates.start.noSpecificTime
              ? new Date(dates.start.localDate).toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                  timeZone: dates.timezone,
                })
              : new Date(dates.start.dateTime).toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                  timeZone: dates.timezone,
                  hour: "2-digit",
                  minute: "2-digit",
                });
            return (
              <Card
                isPressable
                css={{ marginBottom: "20px" }}
                onPress={() => deleteEvent(id)}
              >
                <Card.Body css={{ p: 0 }}>
                  {/* <Card.Image
                    src={images[4].url}
                    srcSet={`${mobileImageUrl} 480w, ${images[4].url} 1000w`}
                    sizes="(max-width: 600px) 480px,
                           800px"
                    objectFit="cover"
                    width="100%"
                    height={340}
                    alt={images[0].title}
                  /> */}
                  <div className={stylesMyEvents.imageWrapper}>
                    {/* <Image
                      src={images[4].url}
                      srcSet={`${mobileImageUrl} 480w, ${images[4].url} 1000w`}
                      sizes="(max-width: 600px) 480px,
                                             800px"
                      fill
                      alt={images[0].title}
                    /> */}

                    <picture>
                      <source
                        srcset={mobileImageUrl}
                        media="(max-width: 600px)"
                      />
                      <img
                        src={images[4].url}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </picture>
                  </div>
                </Card.Body>
                <Card.Body css={{ justifyItems: "flex-start" }}>
                  <Col wrap="wrap" justify="space-between" align="center">
                    <Text
                      h2
                      size={12}
                      weight="bold"
                      transform="uppercase"
                      color="black"
                      css={{ fontSize: "18px" }}
                    >
                      {name} at {embeddedInfo.venues?.[0].name}
                    </Text>
                    <Text h3 color="black" css={{ fontSize: "14px" }}>
                      {distance} miles away
                    </Text>
                    <Text h4 color="black" css={{ fontSize: "14px" }}>
                      On {eventDate}
                    </Text>
                  </Col>
                </Card.Body>
                <Card.Footer
                  css={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    h3
                    color="black"
                    css={{ fontSize: "14px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={url} target="_blank" style={{ padding: "25px" }}>
                      Learn More
                    </a>
                  </Text>
                  <div className={styles.circleDelete}></div>
                </Card.Footer>
              </Card>
            );
          }
        )}
      </div>
    </Layout>
  );
}
