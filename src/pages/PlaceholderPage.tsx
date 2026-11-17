type PlaceholderPageProps = {
  title: string;
  description: string;
};

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="placeholder">
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="development-status">Страница находится в разработке</div>
    </section>
  );
}

export default PlaceholderPage;
