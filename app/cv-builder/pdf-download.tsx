"use client";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from "@react-pdf/renderer";

type Template = "Classic" | "Modern";

type CV = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  objective: string;
  education: string;
  experience: string;
  skills: string;
  languages: string;
  certifications: string;
};

const pdfStyles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 11,
    fontFamily: "Helvetica"
  },

  header: {
    marginBottom: 12
  },

  name: {
    fontSize: 18,
    fontWeight: 700
  },

  meta: {
    marginTop: 4,
    color: "#475569"
  },

  sectionTitle: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: 700
  },

  text: {
    marginTop: 4,
    color: "#0f172a",
    lineHeight: 1.35
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6
  },

  chip: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 10
  }
});

export function PDFDownload({
  cv,
  template,
  ats
}: {
  cv: CV;
  template: Template;
  ats: boolean;
}) {
  const fileName = `${(cv.fullName || "CareerLift-CV").replaceAll(
    " ",
    "_"
  )}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <CVPdf
          cv={cv}
          template={template}
          ats={ats}
        />
      }
      fileName={fileName}
    >
      {({ loading }) => (
        <button
          type="button"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[rgb(var(--primary))] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Preparing PDF..." : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}

function CVPdf({
  cv,
  template,
  ats
}: {
  cv: CV;
  template: Template;
  ats: boolean;
}) {
  const skills = cv.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const accent =
    template === "Modern"
      ? "#2563eb"
      : "#10b981";

  return (
    <Document>
      <Page
        size="A4"
        style={pdfStyles.page}
      >
        <View style={pdfStyles.header}>
          <Text
            style={{
              ...pdfStyles.name,
              color: accent
            }}
          >
            {cv.fullName || "Your Name"}
          </Text>

          <Text style={pdfStyles.meta}>
            {[cv.city, cv.phone, cv.email]
              .filter(Boolean)
              .join(" • ")}
          </Text>
        </View>

        {cv.objective ? (
          <>
            <Text style={pdfStyles.sectionTitle}>
              Summary
            </Text>

            <Text style={pdfStyles.text}>
              {cv.objective}
            </Text>
          </>
        ) : null}

        <Text style={pdfStyles.sectionTitle}>
          Experience
        </Text>

        <Text style={pdfStyles.text}>
          {cv.experience || ""}
        </Text>

        <Text style={pdfStyles.sectionTitle}>
          Education
        </Text>

        <Text style={pdfStyles.text}>
          {cv.education || ""}
        </Text>

        <Text style={pdfStyles.sectionTitle}>
          Skills
        </Text>

        <View style={pdfStyles.chipRow}>
          {skills.map((skill) => (
            <Text
              key={skill}
              style={pdfStyles.chip}
            >
              {skill}
            </Text>
          ))}
        </View>

        <Text style={pdfStyles.sectionTitle}>
          Languages
        </Text>

        <Text style={pdfStyles.text}>
          {cv.languages || ""}
        </Text>

        {cv.certifications ? (
          <>
            <Text style={pdfStyles.sectionTitle}>
              Certifications
            </Text>

            <Text style={pdfStyles.text}>
              {cv.certifications}
            </Text>
          </>
        ) : null}

        <Text
          style={{
            marginTop: 14,
            fontSize: 9,
            color: "#64748b"
          }}
        >
          Generated with CareerLift Pakistan (free tools).{" "}
          {ats ? "ATS-friendly format." : ""}
        </Text>
      </Page>
    </Document>
  );
}
