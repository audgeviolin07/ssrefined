export const fetchWeatherData = async (): Promise<{ areas: { name: string; imageUrl: string }[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          areas: [
            { name: "Siesta Key, Florida", imageUrl: "https://images.unsplash.com/photo-1502028491846-0f287d3d4f29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fHNpZXN0YSUyMGtleSUyMGJlYWNofGVufDB8fHx8MTY4NTI2NTA1OA&ixlib=rb-4.0.3&q=80&w=1080" },
            { name: "Tampa, Florida", imageUrl: "https://images.unsplash.com/photo-1591323585600-df7a2c3b7c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDR8fHRhbXBhJTIwY2l0eXxlbnwwfHx8fDE2ODUyNjUwNTg&ixlib=rb-4.0.3&q=80&w=1080" },
            { name: "Cuba", imageUrl: "../public/image.jpg" },
          ],
        });
      }, 1000);
    });
  };
  
  